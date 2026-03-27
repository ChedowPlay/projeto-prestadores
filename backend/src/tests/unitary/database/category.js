// 250210V


import { createCategory, readCategory, updateCategory, deleteCategory } from "../../../database/business/category/dao.js";


export const testCategory = async () => {
    try {
        // CREATE
        const data = { title: "Category Test" };
        const createResult = await createCategory(data);
        if (!createResult.success) throw "> [Test Category]: Erro na criação da category";
        const category = createResult.category;
        if (!category.category_id) throw "> [Test Category]: category_id não retornado";


        // READ
        const readResult = await readCategory({ category_id: category.category_id }, { single: true });
        if (!readResult.success || !readResult.category) throw "> [Test Category]: Category não encontrada";


        // UPDATE (altera o título)
        const updateResult = await updateCategory({ category_id: category.category_id }, { title: "Updated Category" });
        if (!updateResult.success || updateResult.updated < 1) throw "> [Test Category]: Erro ao atualizar category";


        // READ atualizado
        const readUpdated = await readCategory({ category_id: category.category_id }, { single: true });
        if (readUpdated.category.title !== "Updated Category") throw "> [Test Category]: Category não atualizada";


        // DELETE
        const deleteResult = await deleteCategory({ category_id: category.category_id });
        if (!deleteResult.success || deleteResult.deleted < 1) throw "> [Test Category]: Erro ao deletar category";


        // FOR TEST
        await createCategory({ title: "Categoria 1" });
        await createCategory({ title: "Categoria 2" });


        console.log("   Category\t\t✅");
        return true;
    } catch (error) {
        console.error("   Category ❌", error);
        return false;
    }
};

