// 250210V


import { createWork, readWork, updateWork, deleteWork } from "../../../database/provider/work/dao.js";
import { readProvider } from "../../../database/provider/provider/dao.js";
import { readService } from "../../../database/business/service/dao.js";


export const testWork = async () => {
  try {
    const { providers: providersData } = await readProvider({}, { single: false });
    const providersId = providersData.map((e) => e.provider_id);

    const { services: servicesData } = await readService({}, { single: false });
    const servicesId = servicesData.map((e) => e.service_id);


    // CREATE
    const data = { provider_id: providersId[0], service_id: servicesId[0], description: "Work Test", price: 100.0 };
    const createResult = await createWork(data);
    if (!createResult.success) throw "> [Test Work]: Erro na criação do work";
    const work = createResult.work;
    if (!work.work_id) throw "> [Test Work]: work_id não retornado";


    // READ
    const readResult = await readWork({ work_id: work.work_id }, { single: true });
    if (!readResult.success || !readResult.work) throw "> [Test Work]: Work não encontrado";


    // UPDATE (altera o preço)
    const updateResult = await updateWork({ work_id: work.work_id }, { price: 150.0 });
    if (!updateResult.success || updateResult.updated < 1) throw "> [Test Work]: Erro ao atualizar work";


    // READ atualizado
    const readUpdated = await readWork({ work_id: work.work_id }, { single: true });
    if (readUpdated.work.price !== 150.0) throw "> [Test Work]: Work não atualizado";


    // DELETE
    const deleteResult = await deleteWork({ work_id: work.work_id });
    if (!deleteResult.success || deleteResult.deleted < 1) throw "> [Test Work]: Erro ao deletar work";


    // FOR TEST
    for (let i = 0; i < servicesId.length; i++) {
      await createWork({
        provider_id: providersId[0],
        service_id: servicesId[i],
        description: `Work Test ${i}`,
        price: parseFloat((Math.random() * 120).toFixed(2))
      });
    }

    console.log("   Work\t\t\t✅");
    return true;
  } catch (error) {
    console.error("   Work ❌", error);
    return false;
  }
};

