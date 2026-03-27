// 250308V

import { createWork, readWork, updateWork, deleteWork } from "../../database/provider/work/dao";
import { readProvider } from "../../database/provider/provider/dao";
import { dbModel } from "../../database";
import { z } from "zod";


// Esquema para validação de criação/atualização de trabalho
const workSchema = z.object({
  description: z.string()
    .min(10, "Descrição precisa ter pelo menos 10 caracteres")
    .max(512, "Descrição não pode ter mais de 512 caracteres"),
  price: z.union(
    [
      z.number(),
      z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number)
    ])
    .transform(value => Number(parseFloat(value).toFixed(2))),
  service_id: z.string().uuid("ID do serviço inválido")
});


// Esquema para validação de ID do trabalho
const workIdSchema = z.object({
  work_id: z.string().uuid("ID do trabalho inválido"),
});


const updateSchema = z.object({
  description: z.string()
    .min(10, "Descrição precisa ter pelo menos 10 caracteres")
    .max(512, "Descrição não pode ter mais de 512 caracteres")
    .optional(),
  price: z.union([
    z.number(),
    z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number)])
    .transform(value => Number(parseFloat(value).toFixed(2)))
    .optional(),
  service_id: z.string().uuid("ID do serviço inválido").optional()
});


const workController = async (req, res) => {
  try {
    const user = req?.user;

    // Busca o provider vinculado ao usuário
    const { provider, success: providerSuccess } = await readProvider({ user_id: user.user_id }, {
      single: true,
      include: [
        { as: "plan", model: dbModel.plans },
        { as: "work", model: dbModel.works },
      ]
    });
    if (!providerSuccess) return res.status(403).json({ success: false, error: "Usuário não é um prestador." });
    if (!provider.plan) return res.status(403).json({ success: false, error: "Usuário não possui um plano." });


    // Contabiliza o total de trabalhos por serviço do prestador
    const limitsData = {
      limit: provider.plan?.service || 0,
      total: provider.work.length,
      // Conta quantos serviços únicos o prestador já possui
      count: new Set(provider.work.map(work => work.service_id)).size
    };


    switch (req.method) {
      case "GET": {
        // Busca todos os trabalhos do prestador
        const { success, works } = await readWork(
          { provider_id: provider.provider_id },
          {
            single: false,
            include: [
              { as: "service", model: dbModel.services }
            ],
            order: [["updated_at", "DESC"]]
          }
        );
        if (!success) return res.status(500).json({ success: false, error: "Erro ao buscar trabalhos." });

        // Formata a resposta
        const formattedWorks = works.map(work => ({
          work_id: work.work_id,
          description: work.description,
          price: work.price,
          service_id: work.service_id,
          service_name: work.service?.name
        }));

        return res.status(200).json({ success: true, works: formattedWorks });
      }



      case "POST": {
        // Verifica se a assinatura do usuário está ativa
        const now = new Date();
        if (!provider.expiration_date || provider.expiration_date < now) {
          return res.status(403).json({ success: false, error: "Assinatura expirada. Renove sua assinatura para adicionar novos trabalhos.", subscription_expired: true });
        }

        if (limitsData.total >= limitsData.limit) return res.status(400).json({ success: false, error: "Limite de trabalhos atingido para esse plano." });

        // Valida os dados recebidos
        const parsed = workSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ success: false, error: "Dados inválidos.", issues: parsed?.error?.issues[0] || [] });
        const { description, price, service_id } = parsed.data;

        // Cria o trabalho
        const { success, work } = await createWork({
          provider_id: provider.provider_id,
          description,
          price,
          service_id
        });
        if (!success) return res.status(500).json({ success: false, error: "Erro ao criar trabalho, verifique o service_id." });

        return res.status(201).json({
          success: true,
          message: "Trabalho criado com sucesso.",
          work: {
            work_id: work.work_id,
            description: work.description,
            price: work.price,
            service_id: work.service_id
          }
        });
      }



      case "PUT": {
        const now = new Date();
        if (!provider.expiration_date || provider.expiration_date < now) {
          return res.status(403).json({ success: false, error: "Assinatura expirada. Renove sua assinatura para atualizar o trabalho.", subscription_expired: true });
        }

        // Valida o ID do trabalho
        const parsedId = workIdSchema.safeParse(req.params);
        if (!parsedId.success) return res.status(400).json({ success: false, error: "ID do trabalho inválido.", issues: parsedId?.error?.issues[0] || [] });

        // Valida os dados a serem atualizados (apenas description e price)
        const parsed = updateSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ success: false, error: "Dados inválidos.", issues: parsed?.error?.issues[0] || [] });
        const { work_id } = parsedId.data;

        // Verifica se o trabalho existe e pertence ao prestador
        const { success: readSuccess, work: existingWork } = await readWork({ work_id, provider_id: provider.provider_id }, { single: true });
        if (!readSuccess || !existingWork) return res.status(404).json({ success: false, error: "Trabalho não encontrado." });

        // Atualiza o trabalho
        const { success, updated } = await updateWork({ work_id, provider_id: provider.provider_id }, parsed.data);
        if (!success || updated < 1) return res.status(500).json({ success: false, error: "Erro ao atualizar trabalho." });

        // Busca o trabalho atualizado
        const { work: updatedWork } = await readWork({ work_id }, { single: true });

        return res.status(200).json({
          success: true,
          message: "Trabalho atualizado com sucesso.",
          work: {
            work_id: updatedWork.work_id,
            price: updatedWork.price,
            description: updatedWork.description,
            service_id: updatedWork.service_id,
          }
        });
      }



      case "DELETE": {
        // Valida o ID do trabalho
        const parsed = workIdSchema.safeParse(req.params);
        if (!parsed.success) {
          return res.status(400).json({
            success: false,
            error: "ID do trabalho inválido.",
            issues: parsed?.error?.issues[0] || []
          });
        }

        const { work_id } = parsed.data;

        // Verifica se o trabalho existe e pertence ao prestador
        const { success: readSuccess, work } = await readWork(
          { work_id, provider_id: provider.provider_id },
          { single: true }
        );
        if (!readSuccess || !work) return res.status(404).json({ success: false, error: "Trabalho não encontrado." });

        // Deleta o trabalho
        const { success, deleted } = await deleteWork({ work_id, provider_id: provider.provider_id });
        if (!success || deleted < 1) return res.status(500).json({ success: false, error: "Erro ao deletar trabalho." });

        return res.status(200).json({ success: true, message: "Trabalho removido com sucesso." });
      }



      default:
        return res.status(405).json({ success: false, error: "Método não permitido." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};

export default workController;