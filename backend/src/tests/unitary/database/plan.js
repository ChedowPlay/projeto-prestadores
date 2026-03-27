// 250304V


import { createPlan, readPlan, updatePlan, deletePlan } from "../../../database/business/plan/dao.js";


export const testPlan = async () => {
    try {
        // CREATE
        const data = {
            name: "Test Plan",
            price: 99.99,
            image: 5,
            video: 3
        };
        const createResult = await createPlan(data);

        if (!createResult.success) throw "> [Test Plan]: Erro na criação do plan";
        const plan = createResult.plan;
        if (!plan.plan_id) throw "> [Test Plan]: plan_id não retornado";


        // READ
        const readResult = await readPlan({ plan_id: plan.plan_id }, { single: true });
        if (!readResult.success || !readResult.plan) throw "> [Test Plan]: Plan não encontrado";


        // UPDATE (altera o price)
        const updateResult = await updatePlan({ plan_id: plan.plan_id }, { price: 149.99 });
        if (!updateResult.success || updateResult.updated < 1) throw "> [Test Plan]: Erro ao atualizar plan";


        // READ atualizado
        const readUpdated = await readPlan({ plan_id: plan.plan_id }, { single: true });
        if (readUpdated.plan.price !== 149.99) throw "> [Test Plan]: Plan não atualizado";


        // DELETE
        const deleteResult = await deletePlan({ plan_id: plan.plan_id });
        if (!deleteResult.success || deleteResult.deleted < 1) throw "> [Test Plan]: Erro ao deletar plan";


        // FOR TEST
        await createPlan(data);
        await createPlan({...data, name: "Teste Plan 2"});
        await createPlan({...data, name: "Teste Plan 3"});

        
        console.log("   Plan\t\t\t✅");
        return true;
    } catch (error) {
        console.error("   Plan ❌", error);
        return false;
    }
};
