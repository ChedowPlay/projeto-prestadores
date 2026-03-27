// 250205V

import { createUser, readUser } from "../../database/account/user/dao.js";
import { createToken } from "../../database/auth/token/dao.js";


const complement = {
    password: "Teste@129",
    phone: "123456789",
    whatsapp: "123456789",
    number: 123
}

const dataset = [
    { name: "Usuário Teste 1", email: "teste1@email.com", latitude: "-20.524801", longitude: "-54.657841", city: "Campo Grande", state: "MS", ...complement },
    { name: "Usuário Teste 2", email: "teste2@email.com", latitude: "-20.522345", longitude: "-54.655432", city: "Coxim", state: "MS", ...complement },
    { name: "Usuário Teste 3", email: "teste3@email.com", latitude: "-20.526789", longitude: "-54.659876", city: "Belo Horizonte", state: "MG", ...complement },
    { name: "Usuário Teste 4", email: "teste4@email.com", latitude: "-20.520123", longitude: "-54.653210", city: "Curitiba", state: "PR", ...complement },
    { name: "Usuário Banido", email: "banido@email.com", latitude: "-20.523456", longitude: "-54.656789", city: "Salvador", state: "BA", ...complement },
    { name: "Usuário Teste 5", email: "teste5@email.com", latitude: "-20.522756", longitude: "-54.653810", city: "Florianópolis", state: "SC", ...complement },
    { name: "Usuário Teste 6", email: "teste6@email.com", latitude: "-23.550520", longitude: "-46.633308", city: "São Paulo", state: "SP", ...complement },
    { name: "Usuário Teste 7", email: "teste7@email.com", latitude: "-22.906847", longitude: "-43.172897", city: "Rio de Janeiro", state: "RJ", ...complement },
    { name: "Usuário Teste 8", email: "teste8@email.com", latitude: "-3.731862", longitude: "-38.526670", city: "Campo Grande", state: "CE", ...complement },
    { name: "Usuário Teste 9", email: "teste9@email.com", latitude: "-27.594870", longitude: "-48.548219", city: "Manaus", state: "AM", ...complement },
    { name: "Usuário Teste 10", email: "teste10@email.com", latitude: "-15.799890", longitude: "-47.864140", city: "Brasília", state: "DF", ...complement },
];

export const insertUser = async () => {
    try {
        const tokensTest = [];

        for (const info of dataset) {
            // Tenta criar o usuário
            const createResult = await createUser(info);
            let userId = null;

            if (createResult.success) {
                // console.log('User criado:', JSON.stringify(createResult.user, null, 2));
                userId = createResult.user.user_id;
            } else if (createResult.error === "E-mail em uso.") {
                // Se o usuário já existe, recupera-o
                const { user } = await readUser({ email: info.email }, { single: true });
                // console.log("Usuário já existe. Dados recuperados:", JSON.stringify(user, null, 2));
                userId = user.user_id;
            } else {
                console.error(`> [Insert.User] Erro inesperado ao criar usuário: ${createResult.error}`);
                continue; // Pula para o próximo usuário
            }

            // Cria o token para o usuário (novo ou existente)
            const tokenResult = await createToken({ user_id: userId, access: "token_for_test" });
            tokensTest.push(tokenResult.code);
        }

        console.log("> [Insert.User] Tokens para teste:");
        console.log(JSON.stringify(tokensTest, null, 2));

        return true;
    } catch (error) {
        console.error(`> [Insert.User] Erro ao inserir dados: ${error.message}`);
        return false;
    }
};

