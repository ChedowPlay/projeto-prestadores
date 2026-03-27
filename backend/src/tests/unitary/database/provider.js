// 250304V


import { createProvider, readProvider, updateProvider, deleteProvider } from "../../../database/provider/provider/dao.js";
import { readPlan } from "../../../database/business/plan/dao.js";
import { readUser } from "../../../database/account/user/dao.js";


export const testProvider = async () => {
    try {
        const { plans } = (await readPlan({}, { single: false }));


        const dataUser = (await readUser({ email: 'teste1@exemplo.com' })).user;
        // console.log(JSON.stringify(dataUser, null, 2));
        const userId = dataUser?.user_id;


        // CREATE
        const data = { user_id: userId, bio: "Test Bio", paid_at: new Date(), plan_id: plans[0].plan_id };
        const createResult = await createProvider(data);
        if (!createResult.success) throw "> [Test Provider]: Erro na criação do provider";
        const provider = createResult.provider;
        if (!provider.provider_id) throw "> [Test Provider]: provider_id não retornado";


        // READ (busca por provider_id)
        const readResult = await readProvider({ provider_id: provider.provider_id }, { single: true });
        if (!readResult.success || !readResult.provider) throw "> [Test Provider]: Provider não encontrado";

        // UPDATE (altera a bio)
        const updateResult = await updateProvider({ provider_id: provider.provider_id }, { bio: "Updated Bio" });
        if (!updateResult.success || updateResult.updated < 1) throw "> [Test Provider]: Erro ao atualizar provider";


        // READ atualizado
        const readUpdated = await readProvider({ provider_id: provider.provider_id }, { single: true });
        if (readUpdated.provider.bio !== "Updated Bio") throw "> [Test Provider]: Provider não atualizado";

        // DELETE
        const deleteResult = await deleteProvider({ provider_id: provider.provider_id });
        if (!deleteResult.success || deleteResult.deleted < 1) throw "> [Test Provider]: Erro ao deletar provider";


        // FOR TEST
        await createProvider({ user_id: userId, bio: "Test Bio", paid_at: new Date(), plan_id: plans[0].plan_id });


        console.log("   Provider\t\t✅");
        return true;
    } catch (error) {
        console.error("   Provider ❌", error);
        return false;
    }
};
