// 250206V

import { insertCategoryAndService } from "./database/categoryAndService.js";
import { insertFIle } from "./database/file.js";
import { insertPlan } from "./database/plan.js";
import { insertProvider } from "./database/provider.js";
import { insertUser } from "./database/user.js";
import { insertWork } from "./database/work.js";


// INSERT DB
const block = false;
export const insert = async () => {
    try {

        // Feito para testes
        if (!block) {
            console.log('> [insert]: Inserindo dados de usuário teste.');
            await insertUser();
        } else console.warn('> [insert.user] ⚠️  Insert está desativado');
        

        // Disponível para produção
        console.log('> [insert]: Inserindo dados de Categorias e Serviços.');
        await insertCategoryAndService();


        // Disponível para produção
        console.log('> [insert]: Inserindo dados de Planos e RNs.');
        await insertPlan();


        // Feito para testes
        if (!block) {
            console.log('> [insert]: Inserindo dados de Provider.');
            await insertProvider();

            console.log('> [insert]: Inserindo dados de Works.');
            await insertWork();

            console.log('> [insert]: Inserindo dados de Files.');
            await insertFIle();
        }

        return true;
    } catch (error) {
        return false;
    }
}