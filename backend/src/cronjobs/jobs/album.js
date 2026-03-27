// 250305V


import { readFile } from "../../database/provider/file/dao";
import { time } from "../../services/time";
import { schedule } from 'node-cron';
import path from "path";
import fs from "fs";


const ALBUM_DIR = path.join(process.cwd(), "src/public/media/album");


export const jobRemoverArquivos = () => {
  try {
    // schedule('*/1 * * * *', async () => { // 1m
    schedule('0 */24 * * *', async () => { // 24h
      // console.log("> cronjob: album Iniciando limpeza de arquivos não associados...");

      // Busca todos os arquivos registrados no banco
      const { files } = await readFile({}, { single: false });

      // Lista de arquivos registrados no banco - extraindo apenas os nomes dos arquivos
      const registeredFilePaths = files.map(file => {
        // Verifica se o caminho é uma URL ou um caminho relativo
        if (file.path && file.path.includes('/media/album/')) {
          // Extrai apenas o nome do arquivo da URL ou caminho relativo
          return file.path.split('/').pop();
        } else if (file.url) {
          // Se não tiver path válido, tenta usar a URL
          return file.url.split('/').pop();
        }
        return null;
      }).filter(Boolean); // Remove valores nulos


      // Verifica os diretórios de imagem e vídeo
      const types = ["image", "video"];
      let removedCount = 0;

      for (const type of types) {
        const typeDir = path.join(ALBUM_DIR, type);
        if (!fs.existsSync(typeDir)) continue;

        // Lista todos os arquivos no diretório
        const filesInDir = fs.readdirSync(typeDir);

        // Remove arquivos que não estão no banco
        for (const file of filesInDir) {
          // Compara apenas pelo nome do arquivo
          if (!registeredFilePaths.includes(file)) {
            const filePath = path.join(typeDir, file);
            fs.unlinkSync(filePath);
            removedCount++;
          }
        }
      }

      console.log(`> cronjob: [${time.getFormatedTime()}] Limpeza concluída. ${removedCount} arquivo(s) removido(s).`);
    });

    return 1;
  } catch (error) {
    console.error("> cronjob: Album Error:", error);
    return 0;
  }
};
