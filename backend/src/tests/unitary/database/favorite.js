// 250204V


import { createFavorite, readFavorite, updateFavorite, deleteFavorite } from "../../../database/interactions/favorite/dao.js";
import { readUser } from "../../../database/account/user/dao.js";
import { dbModel } from "../../../database/index.js";


export const testFavorite = async () => {
    try {
        let { user: dataUser } = await readUser({
            email: 'teste1@exemplo.com'
        }, { single: true });

        const providerId = dataUser?.provider?.provider_id;

        dataUser = (await readUser({ email: 'teste2@exemplo.com' })).user;
        const userId = dataUser?.user_id;


        // Para teste, assumimos dois IDs de usuário fictícios: "user1" e "user2".
        const data = { user_id: userId, favorited_id: providerId };
        const createResult = await createFavorite(data);
        if (!createResult.success) throw "> [Test Favorite]: Erro na criação do favorite";
        const favorite = createResult.favorite;
        if (!favorite.favorite_id) throw "> [Test Favorite]: favorite_id não retornado";


        // READ
        const readResult = await readFavorite({ favorite_id: favorite.favorite_id }, { single: true });
        if (!readResult.success || !readResult.favorite) throw "> [Test Favorite]: Favorite não encontrado";


        // UPDATE (se aplicável, como exemplo, tentamos atualizar o favorited_id para o mesmo valor)
        const updateResult = await updateFavorite({ favorite_id: favorite.favorite_id }, { favorited_id: providerId });
        if (!updateResult.success) throw "> [Test Favorite]: Erro ao atualizar favorite";


        // DELETE
        const deleteResult = await deleteFavorite({ favorite_id: favorite.favorite_id });
        if (!deleteResult.success || deleteResult.deleted < 1) throw "> [Test Favorite]: Erro ao deletar favorite";


        // FOR TEST
        await createFavorite({ user_id: userId, favorited_id: providerId });


        console.log("   Favorite\t\t✅");
        return true;
    } catch (error) {
        console.error("   Favorite\t\t❌", error);
        return false;
    }
};

