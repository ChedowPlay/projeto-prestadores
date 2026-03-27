// 250213V


import { dbModel } from "../../database";
import { createComplaint, deleteComplaint, readComplaint } from "../../database/interactions/complaint/dao";
import { readProvider } from "../../database/provider/provider/dao";
import { z } from "zod";


const MAX_COMPLAINTS_FOR_BAN = 3;


const complaintSchema = z.object({
  provider_id: z.string().uuid("id não compatível"),
  description: z.string()
    .min(10, "Descrição precisa ter 10 caracteres como mínimo e 512 como máximo.")
    .max(512, "Descrição precisa ter 10 caracteres como mínimo e 512 como máximo."),
});


const complaintController = async (req, res) => {
  try {
    const user = req?.user;


    switch (req.method) {
      case "GET": {
        const { success, provider } = await readProvider(
          { user_id: user.user_id },
          {
            single: true, attributes: ["provider_id", "user_id", "banned_at"],
            include: [{ as: "complaintsAsAccused", model: dbModel.complaints }],
          }
        );
        if (!success) return res.status(500).json({ success: false, error: "Erro ao buscar reclamações." });
        // return res.status(200).json(provider); // FOR TEST

        // Filtro
        const list = provider.complaintsAsAccused.map((item, i) => {
          return {
            complaint_id: item?.complaint_id,
            provider_id: provider?.provider_id,
            // user_id: item?.user_id,
            description: item?.description,
            about: item?.about,
            // picture: item?.user?.picture_url
          }
        });

        return res.status(200).json({ success: true, complaints: list });
      }



      case "POST": {
        const parsed = complaintSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ success: false, error: "Dados inválidos." });
        const { provider_id, description } = parsed.data;
        // console.log("provider_id", provider_id);


        const { success: successProvider, provider: accused } = await readProvider(
          { provider_id },
          {
            single: true, attributes: ["provider_id", "user_id", "banned_at"],
            include: [{ as: "complaintsAsAccused", model: dbModel.complaints }],
          }
        );
        const complaintsCount = accused.complaintsAsAccused.length;
        // return res.status(200).json(accused); // Apenas para testes

        // Impede que o usuário crie uma reclamação para si
        // if (!successProvider) return res.status(404).json({ success: false, error: "Prestador não encontrado." });
        // if (accused?.user_id === user?.user_id) return res.status(403).json({ success: false, error: "Não é permitido registrar reclamação contra si mesmo." });

        // Cria a reclamação
        const { success: successComplaint, created, complaint } = await createComplaint({ provider_id, description });
        if (!successComplaint) return res.status(500).json({ success: false, error: "Erro ao registrar reclamação." });
        if (!created) return res.status(200).json({ success: true, message: "Você já registrou uma reclamação para esse prestador." });


        // Regra de negócio: Aplica punição ao prestador que tiver complaints >= 3
        if ((complaintsCount >= (MAX_COMPLAINTS_FOR_BAN - 1)) && accused.banned_at == null) {
          accused.banned_at = new Date();
          await accused.save();
          console.log(`> [complaint.post] Prestador ${provider_id} banido:`, !!accused.banned_at, '-', accused.banned_at);
        }


        const extraInfos = { complaint_id: complaint.complaint_id, description: complaint.description };
        return res.status(201).json({ success: true, message: "Reclamação registrada com sucesso.", complaint: extraInfos });
      }



      // ROTA DESATIVADA
      // case "DELETE": {
      //   const { complaint_id } = req.params;
      //   if (!complaint_id) return res.status(400).json({ success: false, error: "ID da reclamação não fornecido." });

      //   const { success, deleted } = await deleteComplaint({ complaint_id, user_id: user.user_id });
      //   if (!success) return res.status(500).json({ success: false, error: "Erro ao deletar reclamação." });
      //   if (!deleted) return res.status(403).json({ success: false, error: "Usuário não tem permissão para remover esta reclamação." });

      //   return res.status(200).json({ success: true, message: "Reclamação removida com sucesso." });
      // }


      default:
        return res.status(405).json({ success: false, error: "Método não permitido." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};

export default complaintController;
