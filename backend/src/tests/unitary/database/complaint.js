// 250204V


import { createComplaint, readComplaint, updateComplaint, deleteComplaint } from "../../../database/interactions/complaint/dao.js";
import { readUser } from "../../../database/account/user/dao.js";


export const testComplaint = async () => {
    try {
        let dataUser = (await readUser({ email: 'teste1@exemplo.com' })).user;
        const providerId = dataUser?.provider.provider_id;

        dataUser = (await readUser({ email: 'teste2@exemplo.com' })).user;
        const userId = dataUser?.user_id;


        // CREATE
        let data = { provider_id: providerId, description: "Complaint Test Description" };
        const createResult = await createComplaint(data);

        data = { user_id: userId, provider_id: providerId, description: "Complaint Test Description" };
        const createResult2 = await createComplaint(data);
        // console.log(JSON.stringify(createResult2, null, 2));


        if (!createResult.success) throw "> [Test Complaint]: Erro na criação da complaint";
        const complaint = createResult.complaint;
        if (!complaint.complaint_id) throw "> [Test Complaint]: complaint_id não retornado";


        // READ
        const readResult = await readComplaint({ complaint_id: complaint.complaint_id }, { single: true });
        if (!readResult.success || !readResult.complaint) throw "> [Test Complaint]: Complaint não encontrada";


        // UPDATE (altera a descrição)
        const updateResult = await updateComplaint({ complaint_id: complaint.complaint_id }, { description: "Updated Complaint Description" });
        if (!updateResult.success || updateResult.updated < 1) throw "> [Test Complaint]: Erro ao atualizar complaint";


        // READ atualizado
        const readUpdated = await readComplaint({ complaint_id: complaint.complaint_id }, { single: true });
        if (readUpdated.complaint.description !== "Updated Complaint Description") throw "> [Test Complaint]: Complaint não atualizada";


        // DELETE
        const deleteResult = await deleteComplaint({ complaint_id: complaint.complaint_id });
        if (!deleteResult.success || deleteResult.deleted < 1) throw "> [Test Complaint]: Erro ao deletar complaint";


        // FOR TEST
        data = { provider_id: providerId, description: "Complaint Test Description" };
        await createComplaint(data);
        await createComplaint(data);
        await createComplaint(data);

        console.log("   Complaint\t\t✅");
        return true;
    } catch (error) {
        console.error("   Complaint ❌", error);
        return false;
    }
};
