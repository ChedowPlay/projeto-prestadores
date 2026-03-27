// 250203V

import { readUser } from "../../../database/account/user/dao.js";
import { createToken, validateToken, deleteToken, removeExpiredTokens } from "../../../database/auth/token/dao.js";

export const testToken = async () => {
    try {
        const dataUser = (await readUser({ email: 'teste1@exemplo.com' })).user;


        // CREATE TOKEN
        const userId = dataUser?.user_id; // ID de exemplo
        const dataTest1 = await createToken({ user_id: userId, access: "a1" });
        const dataTest4 = await createToken({ user_id: userId, access: "a2" });


        // Testando criação
        if (!dataTest1.success) throw "> [Test Token]: Erro na criação do token";
        if (!dataTest1.code) throw "> [Test Token]: Token não retornado após criação";

        // console.log(`> [Test Token]: Token criado`, JSON.stringify(dataTest1, null, 2));


        // VALIDATE TOKEN
        const dataTest2 = await validateToken(dataTest1.code);

        // Testando validação
        if (!dataTest2.success) throw "> [Test Token]: Token inválido ou expirado após criação";
        if (dataTest2.decoded.user_id !== userId) throw "> [Test Token]: ID do token não corresponde ao esperado";

        // console.log(`> [Test Token]: Token validado com sucesso - ID: ${dataTest2.decoded.id}`);


        // REMOVE EXPIRED TOKENS
        const expiredTokensRemoved = await removeExpiredTokens();

        // Testando remoção de tokens expirados (Simulação)
        // console.log(`> [Test Token]: Tokens expirados removidos - ${expiredTokensRemoved} tokens deletados.`);


        // DELETE TOKEN
        const dataTest3 = await deleteToken({ id: 1 }); // Usar o ID real do token criado

        // Testando exclusão
        if (!dataTest3.success) throw "> [Test Token]: Falha ao deletar o token pelo ID";

        // console.log(`> [Test Token]: Token deletado com sucesso.`);


        console.log(`   Token\t\t✅`);
        return true;
    } catch (error) {
        console.error(`   Token ❌ ${error}`);
        return false;
    }
};
