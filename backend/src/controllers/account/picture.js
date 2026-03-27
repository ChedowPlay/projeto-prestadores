// 250217V


import { convertImageToWebp, deleteFile, profile } from "../../middleware/storage/index.js";
import { API_LINK_PICTURE, formatPublicLink } from "../../services/util/index.js";
import path from "path";
import fs from "fs";


const PROFILE_DIR = path.join(process.cwd(), "/src/public/media/picture");
const PROFILE_URL = "/media/picture";


// Certifica-se de que o diretório de perfis existe
if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });


const pictureController = async (req, res) => {
  try {


    switch (req.method) {
      case "PUT": {
        profile.single("picture")(req, res, async (err) => {
          err && console.error("> [account.picture] Erro no upload da foto de perfil:", err)
          if (err) return res.status(400).json({ success: false, error: "Erro no upload da imagem." });

          const user = req.user;
          const oldPicturePath = user.picture_path ? path.join(PROFILE_DIR, user.picture_path) : null;
          const newFilePath = req.file.path;

          // Converte para WEBP
          const webpPath = await convertImageToWebp(newFilePath, true);
          const newFileName = path.basename(webpPath);

          // Remove a imagem antiga se existir
          if (oldPicturePath && fs.existsSync(oldPicturePath)) deleteFile(oldPicturePath);

          // Atualiza o usuário no banco de dados
          user.picture_path = newFileName;
          user.picture_url = `${PROFILE_URL}/${newFileName}`;
          await user.save();

          console.log(`> [account.picture.post] Foto de perfil do usuário ${user.user_id} atualizada. \n  - File Path: ${newFilePath}\n  - Path: ${webpPath}`);
          return res.status(200).json({ success: true, message: "Foto de perfil atualizada.", picture: formatPublicLink(user.picture_url) });
        });

        break;
      }


      case "DELETE": {
        const user = req.user;
        if (!user || !user.picture_path) return res.status(404).json({ success: false, error: "Arquivo não encontrado." });

        const picturePath = path.join(PROFILE_DIR, user.picture_path);
        if (!deleteFile(picturePath)) return res.status(400).json({ success: false, error: "Erro ao deletar arquivo." });

        // await updateUser(user.user_id, { picture: null });
        user.picture_path = null;
        user.picture_url = `${API_LINK_PICTURE}${user.name}`;
        await user.save();

        return res.status(200).json({ success: true, message: "Foto de perfil removida.", picture: formatPublicLink(user.picture_url) });
      }


      default:
        return res.status(405).json({ success: false, error: "Método não permitido." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};


export default pictureController;
