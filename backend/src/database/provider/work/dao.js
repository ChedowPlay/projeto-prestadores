// 250204V

import { dbModel } from "../..";

/**
 * Cria um work.
 * @param {object} data - Dados para criação do work.
 */
export const createWork = async (data) => {
  try {
    const work = await dbModel.works.create(data);
    return { success: true, work };
  } catch (error) {
    console.error(`> Erro ao criar work: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Lê work(s) com base no filtro.
 * @param {object} filter - Critérios para a busca.
 * @param {object} options - Opções adicionais (ex.: { single: true }).
 */
export const readWork = async (filter = {}, options = {}) => {
  try {
    if (options.single) {
      const work = await dbModel.works.findOne({ where: filter, ...options });
      return { success: true, work };
    } else {
      const works = await dbModel.works.findAll({ where: filter, ...options });
      return { success: true, works };
    }
  } catch (error) {
    console.error(`> Erro ao ler work(s): ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza work(s) com base no filtro.
 * @param {object} filter - Critérios para atualização.
 * @param {object} newData - Dados novos para atualização.
 */
export const updateWork = async (filter = {}, newData) => {
  try {
    const result = await dbModel.works.update(newData, { where: filter });
    return { success: true, updated: result[0] };
  } catch (error) {
    console.error(`> Erro ao atualizar work: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Deleta work(s) com base no filtro.
 * @param {object} filter - Critérios para deleção.
 */
export const deleteWork = async (filter = {}) => {
  try {
    const deleted = await dbModel.works.destroy({ where: filter });
    return { success: true, deleted };
  } catch (error) {
    console.error(`> Erro ao deletar work: ${error.message}`);
    return { success: false, error: error.message };
  }
};
