// 250316V

import { readPlan } from "../../database/business/plan/dao.js";
import { readProvider } from "../../database/provider/provider/dao.js";
import mercadopago from "../../services/mercadopago/index.js";
import { z } from "zod";


// Esquema para validação dos dados de entrada
const checkoutSchema = z.object({
  plan_id: z.string().uuid("ID do plano inválido"),
});


/**
 * Controller para criar um payment de plano de negócio via MercadoPago
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
const sendPaymentController = async (req, res) => {
  try {
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, error: "Dados inválidos.", issues: parsed?.error?.issues[0] || [] });
    const { plan_id } = parsed.data;


    const user = req.user;


    const { success: planSuccess, plan } = await readPlan({ plan_id }, { single: true });
    if (!planSuccess || !plan) return res.status(404).json({ success: false, error: "Plano não encontrado." });

    // Busca o provider para verificar se é uma renovação
    const { success: providerSuccess, provider } = await readProvider({ user_id: user.user_id }, { single: true });

    // Adiciona informação sobre renovação nos metadados para o webhook processar corretamente
    const now = new Date();
    const isRenewal = providerSuccess && provider && provider.expiration_date && provider.expiration_date > now;


    // Prepara os dados para o MercadoPago
    const mp_body = {
      plan: {
        id: plan.plan_id,
        reason: plan.name,
        amount: plan.price,
      },
      user: {
        id: user.user_id,
        name: user.name,
        first_name: user.name,
        lastName: "",
        email: user.email,
        address: {
          street: user.street || "",
          number: user.number || "",
        },
      },
      metadata: {
        is_renewal: isRenewal,
      }
    }
    const mp_data = await mercadopago.createCheckout(mp_body);
    console.log("mp_data:", JSON.stringify(mp_data, null, 2));


    if (!mp_data.success) {
      console.error("> [send.payment] Error: ao criar payment -", JSON.stringify(mp_data.error, null, 2));
      return res.status(500).json({ success: false, error: "Erro ao criar payment." });
    }


    const response = {
      success: true,
      message: "Payment criado com sucesso.",
      checkout: mp_data.preference.init_point,
      sendbox: mp_data.preference.sandbox_init_point,
      plan: {
        plan_id: plan.plan_id,
        name: plan.name,
        price: plan.price,
      },
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};

export default sendPaymentController;

/*
const URL = 'http://192.168.100.106:3001';
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGI1ZTg2MWMtY2UwOS00NGE1LWI1NzAtYmY2OWMyNzJhZjRlIiwiZXhwIjoxNzQyNzgzNjY4LCJpYXQiOjE3NDIxNzg4Njh9.Awees4aiFHaPycmd1sQKhTx4HDNag4KhK8kPDXAClGw";

fetch(URL + '/api/payment/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  },
  body: JSON.stringify({
    plan_id: '5371a040-4d50-4127-a11a-eedab988f737',
  })
})
  .then(response => response.json())
  .then(data => console.log('Resposta do payment:', data))
  .catch(error => console.error('Erro:', error));
*/
