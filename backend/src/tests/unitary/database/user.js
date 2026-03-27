// 250203V

import { createUser, deleteUserById, readUser, updateUser, validatePassword } from "../../../database/account/user/dao.js";

export const testUser = async () => {
    try {
        const userIds = [];

        // CREATE
        for (let index = 1; index <= 4; index++) {
            const name = `User Teste ${index}`;
            const password = `pass${index}`;
            const phone = "4567890123";
            const email = `teste${index}@exemplo.com`;

            // console.log(`'${name}', '${phone}', '${email}', '${password}'`);

            const dataTest1 = await createUser({ name, phone, email, password });
            // console.log(created, success);

            // Testa se a criação foi realizada com sucesso
            if (!dataTest1?.success) throw `> [Test User]: Erro no dataTest1 user (success is ${dataTest1?.success})`;
            if (!dataTest1?.created) throw `> [Test User]: Erro no dataTest1 user (created is ${dataTest1?.created})`;
            if (dataTest1.user.name !== name) throw `> [Test User]: Erro no dataTest1 user (name)`;

            userIds.push(dataTest1?.user?.user_id);
        }


        // VALIDATE PASSWORD
        for (let index = 0; index < userIds.length; index++) {
            const password = `pass${index + 1}`;
            const { success: validResult, error } = await validatePassword({ id: userIds[index], password });
            if (!validResult) throw `> [Test User]: Erro na validação de senha para o usuário ${userIds[index]} - ${error}`;
        }
        

        // READ
        // Busca o primeiro usuário criado utilizando o user_id
        const dataTest3 = await readUser({ id: userIds[0] });
        if (!dataTest3.user) throw "> [Test User]: Nenhum usuário retornado no dataTest3";
        if (dataTest3.user.name !== "User Teste 1") throw "> [Test User]: Erro no dataTest3 user (name)";


        // UPDATE - Atualiza o nome do primeiro usuário
        const newName = "User Teste 1 Atualizado";
        const updateResult = await updateUser({ user_id: userIds[0] }, { name: newName });
        if (!updateResult.success || updateResult.updated < 1) throw "> [Test User]: Erro ao atualizar o usuário";
        // Verifica se o nome foi atualizado
        const dataTestUpdate = await readUser({ id: userIds[0] });
        if (!dataTestUpdate.user) throw "> [Test User]: Nenhum usuário retornado após atualização";
        if (dataTestUpdate.user.name !== newName) throw "> [Test User]: Nome do usuário não foi atualizado";


        
        // Tenta buscar um usuário que não existe pelo email
        const dataTest4 = await readUser({ email: 'naoexiste@exemplo.com' });
        if (dataTest4.user) throw "> [Test User]: Erro no dataTest4 user (deveria ser nulo)";


        // DELETE
        // Deleta o terceiro usuário criado
        const dataTest6 = await deleteUserById(userIds[2]);
        if (!dataTest6.success) throw "> [Test User]: Erro ao deletar o usuário";

        console.log(`   User\t\t\t✅`);
        return true;
    } catch (error) {
        console.log(`   User ❌: ${error}`);
        return false;
    }
};
