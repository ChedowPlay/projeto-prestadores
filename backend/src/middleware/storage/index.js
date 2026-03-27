import ffmpeg from "fluent-ffmpeg";
import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";
import path from "path";
import fs from "fs";


// Diretórios de armazenamento
const UPLOAD_DIR = path.join(process.cwd(), "src/public/media");
const PICTURE_DIR = path.join(UPLOAD_DIR, "picture");
const IMAGE_DIR = path.join(UPLOAD_DIR, "album/image");
const VIDEO_DIR = path.join(UPLOAD_DIR, "album/video");


// Certifique-se de que os diretórios existem
[UPLOAD_DIR, PICTURE_DIR, IMAGE_DIR, VIDEO_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});


// Gera um nome único para os arquivos
const generateUniqueName = (originalName) => {
  const ext = path.extname(originalName);
  return crypto
    .createHash("sha256")
    .update(originalName + Date.now().toString())
    .digest("hex") + ext;
};


// Configuração genérica do Multer: 'dest' opcional e tamanho limite (em MB)
const storage = (dest = null, sizeLimit = 100) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const isVideo = file.mimetype.startsWith("video");
        const destino = dest || (isVideo ? VIDEO_DIR : IMAGE_DIR);
        cb(null, destino);
      },
      filename: (_, file, cb) => cb(null, generateUniqueName(file.originalname)),
    }),
    limits: { fileSize: sizeLimit * 1024 * 1024, fieldSize: sizeLimit * 1024 * 1024 },
  });


// Para imagens e vídeos (limite de 100MB)
const album = storage();

// Para fotos de perfil (limite de 4MB)
const profile = storage(PICTURE_DIR, 4);


// Converte imagens para WEBP, redimensionando para 512x512 se 'resize' for true
const convertImageToWebp = async (filePath, resize = false) => {
  const outputFilePath = filePath.replace(path.extname(filePath), ".webp");
  let image = sharp(filePath);
  if (resize) image = image.resize(512, 512, { fit: "cover" });
  await image.webp({ quality: 80 }).toFile(outputFilePath);
  fs.unlinkSync(filePath); // Remove a imagem original
  return outputFilePath;
};


// Converte e comprime vídeos para MP4 usando FFmpeg
const convertVideoToMp4 = (filePath) => {
  return new Promise((resolve, reject) => {
    let ext = path.extname(filePath).toLowerCase();
    let outputFilePath;

    if (ext === ".mp4") outputFilePath = filePath.replace(/\.mp4$/i, "_cnvrtd.mp4");
    else outputFilePath = filePath.replace(ext, ".mp4");

    ffmpeg(filePath)
      .duration(60) // Travado em 1s para ambiente dev
      .videoCodec("libx264")
      .outputOptions("-crf", "28")
      .on("end", () => {
        try {
          fs.unlinkSync(filePath); // Remove o vídeo original
        } catch (unlinkErr) {
          console.warn("Erro ao remover o arquivo original:", unlinkErr);
        }
        resolve(outputFilePath);
      })
      .on("error", (err) => {
        console.error("Erro durante a conversão do vídeo:", err);
        reject(new Error("Erro na conversão do vídeo."));
      })
      .save(outputFilePath);
  });
};


// Função para deletar arquivos
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    return false;
  }
};


// Middleware de erro para upload: não expõe detalhes sensíveis
const handleUploadError = (err, req, res, next) => {
  console.error("> Error <middleware.storage>:", err);
  if (err instanceof multer.MulterError) {
    return res.status(413).json({ error: "O tamanho do arquivo excede o limite permitido." });
  } else if (err) {
    return res.status(err.statusCode || 500).json({ error: "Ocorreu um erro no upload do arquivo." });
  }
  next();
};


export { album, profile, convertImageToWebp, convertVideoToMp4, deleteFile, handleUploadError };
