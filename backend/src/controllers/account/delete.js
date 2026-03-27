// 250316V


import { deleteFile as deleteFileFromDisk } from "../../services/fileManager/index.js";
import { deleteProvider, readProvider } from "../../database/provider/provider/dao.js";
import { deleteWork, readWork } from "../../database/provider/work/dao.js";
import { deleteFile, readFile } from "../../database/provider/file/dao.js";
import { deleteUserById } from "../../database/account/user/dao.js";
import { dbModel } from "../../database/index.js";
import path from "path";
import fs from "fs";


// Diretórios de armazenamento
const UPLOAD_DIR = path.join(process.cwd(), "src/public/media");
const PICTURE_DIR = path.join(UPLOAD_DIR, "picture");
// const IMAGE_DIR = path.join(UPLOAD_DIR, "album/image");
// const VIDEO_DIR = path.join(UPLOAD_DIR, "album/video");


/**
 * Controller para deletar a conta do usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
const deleteAccountController = async (req, res) => {
  const user = req.user;

  try {
    // Busca o provider associado ao usuário
    const { success: providerSuccess, provider } = await readProvider({ user_id: user?.user_id }, { single: true });

    // Verifica se o usuário tem uma assinatura ativa
    if (providerSuccess && provider) {
      const now = new Date();
      if (provider?.expiration_date && provider?.expiration_date > now) {
        return res.status(403).json({
          success: false,
          error: "Não é possível excluir a conta enquanto houver uma assinatura ativa.",
          expiration_date: provider.expiration_date
        });
      }
    }


    // INICIA FLUXO DE EXCLUSÃO DE DADOS
    // 1. Exclui os tokens e OTPs do usuário
    try {
      // Remove todos os tokens do usuário
      await dbModel.tokens.destroy({ where: { user_id: user?.user_id } });
      
      // Remove todos os OTPs do usuário
      await dbModel.otps.destroy({ where: { user_id: user?.user_id } });
    } catch (error) {
      console.error("Erro ao excluir tokens e OTPs:", error);
      // Continua com o processo mesmo se houver erro aqui
    }

    // 2. Exclui as interações (favoritos e denúncias)
    try {
      // Remove favoritos criados pelo usuário
      await dbModel.favorites.destroy({ where: { user_id: user?.user_id } });
      
      // Remove denúncias feitas pelo usuário
      await dbModel.complaints.destroy({ where: { user_id: user?.user_id } });
    } catch (error) {
      console.error("Erro ao excluir interações:", error);
      // Continua com o processo mesmo se houver erro aqui
    }

    // 3. Exclui os trabalhos do provider
    if (providerSuccess && provider) {
      const { success: worksSuccess, works } = await readWork({ provider_id: provider?.provider_id }, { single: false });
      if (worksSuccess && works && works.length > 0) {
        for (const work of works) {
          await deleteWork({ work_id: work?.work_id });
        }
      }

      // 4. Exclui os arquivos do provider (registros do banco e arquivos físicos)
      const { success: filesSuccess, files } = await readFile({ provider_id: provider?.provider_id }, { single: false });
      if (filesSuccess && files && files.length > 0) {
        for (const file of files) {
          // Exclui o arquivo físico
          if (file.path && fs.existsSync(file.path)) {
            deleteFileFromDisk(file.path);
          }
          // Exclui o registro do banco
          await deleteFile({ file_id: file?.file_id });
        }
      }

      // 5. Remove favoritos onde o provider foi favoritado
      try {
        await dbModel.favorites.destroy({ where: { favorited_id: provider?.provider_id } });
      } catch (error) {
        console.error("Erro ao excluir favoritos do provider:", error);
      }

      // 6. Remove denúncias contra o provider
      try {
        await dbModel.complaints.destroy({ where: { provider_id: provider?.provider_id } });
      } catch (error) {
        console.error("Erro ao excluir denúncias do provider:", error);
      }

      // 7. Exclui o provider
      await deleteProvider({ provider_id: provider?.provider_id });
    }

    // 5. Exclui a foto de perfil do usuário, se existir
    if (user?.picture_path) {
      const picturePath = path.join(PICTURE_DIR, user?.picture_path);
      if (fs.existsSync(picturePath)) {
        deleteFileFromDisk(picturePath);
      }
    }

    // 6. Exclui o usuário. Adeus amigo :(
    const { success: deleteSuccess } = await deleteUserById(user?.user_id);
    if (!deleteSuccess) return res.status(500).json({ success: false, error: "Erro ao excluir a conta." });
    // Se falhar, retorna erro, ferrou, pq não tem fallback :/ 

    return res.status(200).json({ success: true, message: "Conta excluída com sucesso, todos os dados foram removidos." });
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    return res.status(500).json({ success: false, error: "Erro inesperado ao excluir a conta." });
  }
};

export default deleteAccountController;
