// 250206V

import { createFile, readFile } from "../../database/provider/file/dao.js";
import { readProvider } from "../../database/provider/provider/dao.js";


export const insertFIle = async () => {
    try {
        const { providers } = await readProvider({}, { single: false });
        const providersIds = providers.map((e) => e.provider_id);


        const data = {
            provider_id: providersIds[0],
            type: "image",
            path: "file_path_test",
            url: "https://picsum.photos/500/800"
        };


        const { file: fileData } = await readFile({ path: data.path }, { single: true });
        if (!fileData) {
            await createFile({ ...data, path: "file_path_test" });
            await createFile({ ...data, path: "file_path_test 1" });
            await createFile({ ...data, path: "file_path_test 2" });
            await createFile({ ...data, path: "file_path_test 2" });
            await createFile({ ...data, path: "file_path_test 4" });
        }
        return true;
    } catch (error) {
        console.error(`> [Insert.File] Erro ao inserir dados: ${error.message}`);
        return false;
    }
};

