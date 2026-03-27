// 250210V


import { createService, readService, updateService, deleteService } from "../../../database/business/service/dao.js";
import { readCategory } from "../../../database/business/category/dao.js";


export const testService = async () => {
    try {
        const { categories } = await readCategory({}, { single: false });
        const categoriesIds = categories.map((e) => e.category_id);
        // console.log(categoriesIds, typeof categoriesIds);


        // CREATE
        const data = { category_id: categoriesIds[0], title: "Service Test" };
        const createResult = await createService(data);
        if (!createResult.success) throw "> [Test Service]: Erro na criação do service";
        const service = createResult.service;
        if (!service.service_id) throw "> [Test Service]: service_id não retornado";


        // READ
        const readResult = await readService({ service_id: service.service_id }, { single: true });
        if (!readResult.success || !readResult.service) throw "> [Test Service]: Service não encontrado";


        // UPDATE (altera o título)
        const updateResult = await updateService({ service_id: service.service_id }, { title: "Service Test Updated" });
        if (!updateResult.success || updateResult.updated < 1) throw "> [Test Service]: Erro ao atualizar service";


        // READ atualizado
        const readUpdated = await readService({ service_id: service.service_id }, { single: true });
        if (readUpdated.service.title !== "Service Test Updated") throw "> [Test Service]: Service não atualizado";


        // DELETE
        const deleteResult = await deleteService({ service_id: service.service_id });
        if (!deleteResult.success || deleteResult.deleted < 1) throw "> [Test Service]: Erro ao deletar service";


        // FOR TEST
        for (let i = 0; i < categoriesIds.length; i++) {
            for (let j = 0; j < 3; j++) {
                await createService({ category_id: categoriesIds[i], title: `Service Test ${j}` });
            }
        }


        console.log("   Service\t\t✅");
        return true;
    } catch (error) {
        console.error("   Service ❌", error);
        return false;
    }
};
