// 250215V


import { createFile, readFile, updateFile, deleteFile } from "../../../database/provider/file/dao.js";
import { readProvider } from "../../../database/provider/provider/dao.js";


export const testFile = async () => {
    try {
        const { providers } = await readProvider({}, { single: false });
        const providersIds = providers.map((e) => e.provider_id);


        // CREATE
        const data = {
            // service_id: servicesIds[0],
            provider_id: providersIds[0],
            type: "image",
            path: null,
            url: "https://picsum.photos/500/800"
        };
        const createResult = await createFile(data);
        if (!createResult.success) throw "> [Test File]: Erro na criação do file";
        const file = createResult.file;
        if (!file.file_id) throw "> [Test File]: file_id não retornado";

        // READ
        const readResult = await readFile({ file_id: file.file_id }, { single: true });
        if (!readResult.success || !readResult.file) throw "> [Test File]: File não encontrado";

        // UPDATE (altera o identifier)
        const updateResult = await updateFile({ file_id: file.file_id }, { path: "updated_path" });
        if (!updateResult.success || updateResult.updated < 1) throw "> [Test File]: Erro ao atualizar file";

        // READ atualizado
        const readUpdated = await readFile({ file_id: file.file_id }, { single: true });
        if (readUpdated.file.path !== "updated_path") throw "> [Test File]: File não atualizado";

        // DELETE
        const deleteResult = await deleteFile({ file_id: file.file_id });
        if (!deleteResult.success || deleteResult.deleted < 1) throw "> [Test File]: Erro ao deletar file";


        // FOR TEST
        await createFile(data);

        console.log("   File\t\t\t✅");
        return true;
    } catch (error) {
        console.error("   File ❌", error);
        return false;
    }
};
