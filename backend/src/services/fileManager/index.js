import path from 'path';
import fs from 'fs';


export const deleteFile = (filePath = '') => {
    try {
        if (fs.existsSync(filePath)) {
            const stats = fs.lstatSync(filePath);
            if (stats.isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true });
                console.log(`> Diretório ${filePath} deletado com sucesso.`);
            } else {
                fs.unlinkSync(filePath);
                console.log(`> Arquivo ${filePath} deletado com sucesso.`);
            }
            return true;
        } else {
            console.error('[fileManager.deleteFile] Arquivo ou diretório não encontrado');
            return false;
        }
    } catch (err) {
        console.error(`[fileManager.deleteFile] Erro ao deletar o arquivo ou diretório: ${err.message}`);
        return false;
    }
};


export const openFile = (filePath = '') => {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return data;
        } else {
            console.error('Arquivo não encontrado');
            return null;
        }
    } catch (err) {
        console.error(`Erro ao abrir o arquivo: ${err.message}`);
        return null;
    }
}


export const createOrEditFile = (filePath = '', content = '') => {
    try {
        const dir = path.dirname(filePath);

        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(filePath, content, { encoding: 'utf8' });

        return true;
    } catch (err) {
        console.error(`[fileManager.createOrEditFile] Erro ao criar/sobrescrever o arquivo: ${err.message}`);
        return false;
    }
}