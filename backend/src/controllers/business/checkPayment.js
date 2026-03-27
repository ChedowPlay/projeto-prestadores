// 250317V


import { updateProvider } from "../../database/provider/provider/dao.js";
import { validateToken } from "../../database/auth/token/dao.js";
import { readPlan } from "../../database/business/plan/dao.js";
import { readUser } from "../../database/account/user/dao.js";
import mercadopago from "../../services/mercadopago/index.js";
import { dbModel } from "../../database/index.js";


/**
 * Controller para receber e processar webhooks do MercadoPago
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
const checkPaymentController = async (req, res) => {
  try {
    // Log para debug
    console.log("Webhook recebido - Método:", req.method);
    console.log("Query params:", JSON.stringify(req.query, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));
    console.log("Headers:", JSON.stringify(req.headers, null, 2));


    // Extrai parâmetros da query
    const { status, collection_status, external_reference, preference_id, date_approved, payment_id } = req.query;
    console.warn("> [check.payment] Query:", JSON.stringify({ status, collection_status, external_reference, preference_id, date_approved, payment_id }, null, 2));


    // Obtenção do identificador do usuário (user_id) via query ou token JWT
    let userId = external_reference;
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const { success, decoded } = await validateToken(token);
      if (success && decoded?.user_id) {
        // Se o external_reference estiver presente, garanta que ele corresponda ao user_id do token
        if (userId && userId !== decoded.user_id) {
          console.warn("> [check.payment]: Token de usuário não corresponde ao external_reference");
          return res.status(403).json({ success: false, error: "Token de usuário não corresponde ao external_reference" });
        }
        userId = decoded.user_id;
      } else {
        console.warn("> [check.payment]: Token JWT inválido");
        return res.status(403).json({ success: false, error: "Token JWT inválido" });
      }
    } else if (!userId) {
      console.warn("> [check.payment]: Nenhum identificador de usuário fornecido (external_reference ou token)");
      return res.status(400).json({ success: false, error: "Identificador de usuário não fornecido" });
    }


    // Busca o pagamento pelo external_reference (user_id) e payment_id se disponível
    let paymentFilter = {
      external_reference: userId,
      sort: "date_created",// Ordena por data de criação (mais recente primeiro)
      criteria: "desc", // Alterado para desc para garantir que o mais recente venha primeiro
    };
    // Se tiver payment_id, usa-o para busca específica
    // if (payment_id) {
    //   paymentFilter.id = payment_id;
    // }
    const { payments } = await mercadopago.readPayment(null, paymentFilter);
    if (!payments || !payments.results || payments.results.length === 0) {
      console.warn("> [check.payment]: Nenhum pagamento encontrado para o usuário", userId);
      return res.status(404).json({ success: false, error: "Nenhum pagamento encontrado para o usuário." });
    }


    // Pega o pagamento mais recente
    const payment = payments.results[0];
    console.log("Último pagamento:", JSON.stringify(payment, null, 2));


    // Validação do pagamento aprovado
    const isPaymentApproved = (
      payment.status === "approved" &&
      payment.status_detail === "accredited" &&
      payment.captured === true
    );
    console.log("> [check.payment]: userId:", userId, isPaymentApproved ? "Pagamento confirmado!" : "Pagamento não confirmado.");


    // Se houver preference_id, valida o checkout e o metadata
    if (preference_id) {
      const { checkout } = await mercadopago.readCheckout(preference_id);
      if (!checkout || !checkout.metadata || checkout.metadata.user_id !== userId) {
        console.warn("> [check.payment]: Id de usuário no checkout não corresponde", checkout?.metadata?.user_id, userId);
        return res.status(400).json({ success: false, error: "Id de usuário incompatível no checkout, pagamento não confirmado." });
      }
    }


    // Busca o usuário no sistema com base no userId
    const { success: userSuccess, user } = await readUser({ id: userId }, {
      single: true,
      include: [
        {
          as: "provider", model: dbModel.providers,
          include: [
            { as: "plan", model: dbModel.plans },
          ]
        },
      ]
    });
    if (!userSuccess || !user) {
      console.warn("> [check.payment]: Usuário não encontrado para id:", userId);
      return res.status(404).json({ success: false, error: "Usuário não encontrado." });
    }
    const provider = user.provider;


    // Se o pagamento estiver aprovado, atualiza o status do provider
    if (isPaymentApproved) {
      const now = new Date();

      // Verifica se este pagamento já foi processado anteriormente
      const paymentId = payment.id.toString();
      const preferenceIdStr = preference_id ? preference_id.toString() : null;
      const currentPaymentIdentifier = preferenceIdStr || paymentId;

      // Se o provider já tem este mesmo ID de pagamento registrado, significa que já foi processado
      if (provider.mp_service_id === currentPaymentIdentifier) {
        console.log("> [check.payment]: Pagamento já processado anteriormente para o usuário", userId);
        return res.status(200).json({ success: true, message: "Pagamento já foi processado anteriormente" });
      }

      // Calcula nova data de expiração (adiciona 30 dias)
      let expirationDate;
      if (provider.expiration_date && provider.expiration_date > now) {
        expirationDate = new Date(provider.expiration_date);
        expirationDate.setDate(expirationDate.getDate() + 30);
      } else {
        expirationDate = new Date(now);
        expirationDate.setDate(expirationDate.getDate() + 30);
      }


      // Determina o plano a ser utilizado a partir do metadata do pagamento
      const planIdToUse = payment.metadata?.plan_id;
      if (!planIdToUse) {
        console.warn("> [check.payment]: Plano não identificado no pagamento");
        return res.status(400).json({ success: false, error: "Plano não identificado no pagamento." });
      }
      const { plan: myPlan } = await readPlan({ plan_id: planIdToUse }, { single: true });
      if (!myPlan) {
        console.warn("> [check.payment]: Plano não encontrado para id:", planIdToUse);
        return res.status(404).json({ success: false, error: "Plano não encontrado." });
      }


      const updateData = {
        paid_at: now,
        payment_at: now,
        mp_service_id: currentPaymentIdentifier,
        expiration_date: expirationDate,
        plan_id: myPlan.plan_id,
      };
      const { success: updateSuccess } = await updateProvider({ user_id: userId }, updateData);
      if (!updateSuccess) {
        console.warn("> [check.payment]: Erro ao atualizar o provider para usuário", userId);
        return res.status(500).json({ success: false, error: "Erro ao atualizar status do provider" });
      }
      return res.status(200).json({ success: true, message: "Pagamento aprovado e provider atualizado" });
    } else if (payment.status === "rejected" || collection_status === "rejected") {
      return res.status(200).json({ success: true, message: "Pagamento rejeitado" });
    } else {
      const currentStatus = status || collection_status || (payment ? payment.status : "desconhecido");
      return res.status(200).json({ success: true, message: `Status do pagamento: ${currentStatus}` });
    }


  } catch (error) {
    console.error("> [check.payment] Erro ao processar:", error);
    return res.status(500).json({ success: false, error: "Erro interno." });
  }
};


export default checkPaymentController;
