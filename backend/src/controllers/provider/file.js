// 250305V


import { album, convertImageToWebp, convertVideoToMp4, deleteFile } from "../../middleware/storage";
import { createFile, readFile } from "../../database/provider/file/dao";
import { readProvider } from "../../database/provider/provider/dao";
import { formatPublicLink } from "../../services/util";
import { dbModel } from "../../database";
import { z } from "zod";
import path from "path";
import fs from "fs";


const ALBUM_DIR = path.join(process.cwd(), "src/public/media/album");

// Certifica-se de que o diretório de arquivos existe
if (!fs.existsSync(ALBUM_DIR)) fs.mkdirSync(ALBUM_DIR, { recursive: true });


const fileSchema = z.object({
  file_id: z.string().uuid(),
});


const fileController = async (req, res) => {
  try {
    const user = req.user;

    // Busca o provider vinculado ao usuário
    const { provider, success: providerSuccess } = await readProvider({ user_id: user.user_id }, {
      single: true,
      include: [
        { as: "plan", model: dbModel.plans },
        { as: "file", model: dbModel.files },
      ]
    });
    if (!providerSuccess) return res.status(400).json({ success: false, error: "Usuário não é um prestador." });

    // Contabiliza o total de imagens e vídeos do usuário
    const limitsData = {
      video: {
        limit: provider.plan.video,
        total: provider.file.filter(file => file.type === "video").length,
      },
      image: {
        limit: provider.plan.image,
        total: provider.file.filter(file => file.type === "image").length,
      },
    }



    switch (req.method) {
      case "POST": {
        // Verifica se a assinatura do usuário está ativa
        const now = new Date();
        if (!provider.expiration_date || provider.expiration_date < now) {
          return res.status(403).json({ success: false, error: "Assinatura expirada. Renove sua assinatura para adicionar novos arquivos.", subscription_expired: true });
        }

        // Verifica o tipo de arquivo que está sendo enviado
        const isVideo = req.file?.mimetype?.startsWith("video");

        // Verifica se o usuário já atingiu o limite de arquivos do seu plano
        if (isVideo && (limitsData.video.total >= limitsData.video.limit)) {
          return res.status(400).json({ success: false, error: `Limite de vídeos atingindo.`, ...limitsData });
        }

        if (!isVideo && (limitsData.image.total >= limitsData.image.limit)) {
          return res.status(400).json({ success: false, error: `Limite de imagens atingindo.`, ...limitsData });
        }


        // Motor para salvar imagens no sistema
        album.single("file")(req, res, async (err) => {
          err && console.error("> [provider.file] Erro no upload do arquivo:", err)
          if (err) return res.status(400).json({ success: false, error: "Erro no upload do arquivo." });

          const filePath = req.file.path;
          let processedFilePath = filePath;

          if (!isVideo) { // IMAGEM
            processedFilePath = await convertImageToWebp(filePath);
            limitsData.image.total++;
          }
          else { // VIDEO
            processedFilePath = await convertVideoToMp4(filePath);
            limitsData.video.total++;
          }

          const newFileName = path.basename(processedFilePath);
          const fileUrl = `/media/album/${isVideo ? "video" : "image"}/${newFileName}`;

          // Salva no banco de dados
          const { success, file } = await createFile({
            provider_id: provider.provider_id,
            path: processedFilePath,
            url: fileUrl,
            type: isVideo ? "video" : "image",
          });
          if (!success) return res.status(500).json({ success: false, error: "Erro interno ao salvar arquivo." });

          return res.status(201).json({ success: true, message: "Postagem realizada.", ...limitsData, url: formatPublicLink(fileUrl), file_id: file.file_id, type: file.type });
        });

        break;
      }



      case "DELETE": {
        const parsed = fileSchema.safeParse(req?.params);
        if (!parsed.success) return res.status(400).json({ success: false, issues: parsed?.error?.issues[0] || [], error: "ID do arquivo não informado." });
        const { file_id } = parsed.data;

        // Busca o arquivo no banco de dados
        const { file, success: fileSuccess } = await readFile({ file_id, provider_id: provider.provider_id }, { single: true });
        if (!fileSuccess || !file) return res.status(404).json({ success: false, error: "Arquivo não encontrado." });

        // const filePath = path.join(`${ALBUM_DIR}/${file.type}`, file.path);

        if (!deleteFile(file.path)) return res.status(500).json({ success: false, error: "Erro interno ao deletar arquivo." });
        await file.destroy();

        if (file.type === "image") limitsData.image.total--;
        else limitsData.video.total--;

        return res.status(200).json({ success: true, message: "Arquivo removido.", ...limitsData });
      }



      default:
        return res.status(405).json({ success: false, error: "Método não permitido." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};

export default fileController;
