// 250309V


import { updateProvider, createProvider } from "../../database/provider/provider/dao";
import { readUser, updateUser } from "../../database/account/user/dao";
import getProvider from "../provider/get";
import { env } from "../../services/env";
import { dbModel } from "../../database";
import { z } from "zod";


const putSchema = z.object({
  // USUÁRIO COMUM
  name: z.string().min(2).optional(),
  phone: z.string().min(10).max(15).optional(),

  whatsapp: z.string().min(10).max(15).optional(),

  accept_privacy_Policy: z.boolean().optional(),
  accept_terms_use: z.boolean().optional(),

  allow_see_address: z.boolean().optional(),
  address: z.object({
    cep: z.string().min(8).max(8),
    city: z.string().min(2).max(64),
    state: z.string().min(2).max(2),
    street: z.string().min(2).max(64),
    number: z.string().min(1).max(8),
    latitude: z.string().min(12).max(12).optional(),
    longitude: z.string().min(12).max(12).optional(),
  }).optional(),

  // USUÁRIO PRESTADOR (Adress é obrigatório)
  provider: z.object({
    bio: z.string().min(1).max(256),
  }).optional(),
});


const put = async (req, res) => {
  try {
    // Validação dos dados recebidos
    const parsed = putSchema.safeParse(req?.body);

    if (!parsed.success) return res.status(400).json({ success: false, issues: parsed?.error?.issues[0] || [], error: "Dados inválidos." });
    const newUserData = parsed.data;
    const { provider: newProviderData } = parsed.data;

    // console.log("newUserData:", JSON.stringify(newUserData, null, 2));
    // console.log("newProviderData:", JSON.stringify(newProviderData, null, 2));

    const userid = req.user.user_id;


    const currentUserData = await getUser(userid);
    // console.log("currentUserData:", JSON.stringify(currentUserData.user.provider, null, 2));
    if (!currentUserData.success) return res.status(404).json({ success: false, error: "Usuário não encontrado." });


    // Monta o objeto com os dados novos
    const formatNewData = {
      name: newUserData?.name,
      phone: newUserData?.phone,
      whatsapp: newUserData?.whatsapp,
      accept_privacy_Policy: newUserData?.accept_privacy_Policy,
      accept_terms_use: newUserData?.accept_terms_use,
      allow_see_address: newUserData?.allow_see_address,
      ...newUserData?.address,
    };

    // Remove chaves com valor undefined ou null
    const filteredData = Object.fromEntries(Object.entries(formatNewData).filter(([_, value]) => value !== undefined && value !== null));

    // Se houver algum dado para atualizar, atualiza o usuário
    if (Object.keys(filteredData).length > 0) {
      // Se o novo dado contém "name" e o usuário atual utiliza um picture_url que inclui o padrão do env.PROFILE_PIC_AP,
      // atualiza o seed da imagem para o novo nome do usuário.
      if (filteredData.name && currentUserData?.user?.picture_url && currentUserData.user.picture_url.includes(env.PROFILE_PIC_API)) {
        filteredData.picture_url = `${env.PROFILE_PIC_API}${encodeURIComponent(filteredData.name)}`;
      }
      const putUserResult = await updateUser({ user_id: userid }, filteredData);
      if (putUserResult.updated < 1) return res.status(500).json({ success: false, error: "Erro ao atualizar dados do usuário." });
    }


    // Criar novo prestador, se ele já existir o sistema interno do create vai ignorar
    if (newProviderData) {
      const isExistingProvider = currentUserData?.user?.provider;

      // Se estiver criando provider e não houver endereço, retorna erro
      if (!isExistingProvider && !newUserData?.address) {
        return res.status(400).json({ success: false, error: "Endereço é obrigatório para criar um prestador." });
      }

      // Se o provider já existe, atualiza; caso contrário, cria um novo
      const result = isExistingProvider
        ? await updateProvider({ user_id: userid }, newProviderData)
        : await createProvider({ ...newProviderData, user_id: userid });

      // Verifica se a operação teve sucesso
      if (!result.success || (isExistingProvider && result.updated < 1)) {
        // Em caso de erro na criação, faz rollback dos dados do usuário
        if (!isExistingProvider) {
          await updateUser({ user_id: userid }, currentUserData.data);
          return res.status(500).json({ success: false, error: "Erro ao criar dados do prestador." });
        }
        return res.status(500).json({ success: false, error: "Erro ao atualizar dados do prestador." });
      }
    }


    // Buscar dados atualizados do usuário
    const updatedUserData = await getUser(userid);


    // Continua na api provider/get.js
    return await getProvider(req, res);


    // return res.status(200).json({ success: true, message: "Dados atualizados com sucesso.", data: updatedUserData.data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};


const getUser = async (id) => {
  const res = await readUser({ id }, {
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
  return res;
}


export default put;
