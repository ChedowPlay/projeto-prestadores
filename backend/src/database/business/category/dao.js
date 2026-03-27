// 250204V

import { where } from "sequelize";
import { dbModel } from "../..";

/**
 * Cria uma category.
 * @param {object} data - Dados para criação da category.
 */
export const createCategory = async (data) => {
  const { title } = data;

  try {
    const [category, created] = await dbModel.categories.findOrCreate({ where: { title }, defaults: data });
    return { success: true, created, category };
  } catch (error) {
    console.error(`> Erro ao criar category: ${error.message}`);
    return { success: false, created: false, error: error.message };
  }
};

/**
 * Lê category(s) com base no filtro.
 * @param {object} filter - Critérios para a busca.
 * @param {object} options - Opções adicionais (ex.: { single: true }).
 */
export const readCategory = async (filter = {}, options = {}) => {
  try {
    if (options.single) {
      const category = await dbModel.categories.findOne({ where: filter, ...options });
      return { success: true, category };
    } else {
      const categories = await dbModel.categories.findAll({ where: filter, ...options });
      return { success: true, categories };
    }
  } catch (error) {
    console.error(`> Erro ao ler category(s): ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza category(s) com base no filtro.
 * @param {object} filter - Critérios para atualização.
 * @param {object} newData - Dados novos para atualização.
 */
export const updateCategory = async (filter = {}, newData) => {
  try {
    const result = await dbModel.categories.update(newData, { where: filter });
    return { success: true, updated: result[0] };
  } catch (error) {
    console.error(`> Erro ao atualizar category: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Deleta category(s) com base no filtro.
 * @param {object} filter - Critérios para deleção.
 */
export const deleteCategory = async (filter = {}) => {
  try {
    const deleted = await dbModel.categories.destroy({ where: filter });
    return { success: true, deleted };
  } catch (error) {
    console.error(`> Erro ao deletar category: ${error.message}`);
    return { success: false, error: error.message };
  }
};

