// 250204V

import { dbModel } from "../..";

/**
 * Cria um file.
 * @param {object} data - Dados para criação do file.
 */
export const createFile = async (data) => {
  try {
    const file = await dbModel.files.create(data);
    return { success: true, created: true, file };
  } catch (error) {
    console.error(`> Erro ao criar file: ${error.message}`);
    return { success: false, created: false, error: error.message };
  }
};

/**
 * Lê file(s) com base no filtro.
 * @param {object} filter - Critérios para a busca.
 * @param {object} options - Opções adicionais (ex.: { single: true }).
 */
export const readFile = async (filter = {}, options = {}) => {
  try {
    if (options.single) {
      const file = await dbModel.files.findOne({ where: filter, ...options });
      return { success: true, file };
    } else {
      const files = await dbModel.files.findAll({ where: filter, ...options });
      return { success: true, files };
    }
  } catch (error) {
    console.error(`> Erro ao ler file(s): ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza file(s) com base no filtro.
 * @param {object} filter - Critérios para atualização.
 * @param {object} newData - Dados novos para atualização.
 */
export const updateFile = async (filter = {}, newData) => {
  try {
    const result = await dbModel.files.update(newData, { where: filter });
    return { success: true, updated: result[0] };
  } catch (error) {
    console.error(`> Erro ao atualizar file: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Deleta file(s) com base no filtro.
 * @param {object} filter - Critérios para deleção.
 */
export const deleteFile = async (filter = {}) => {
  try {
    const deleted = await dbModel.files.destroy({ where: filter });
    return { success: true, deleted };
  } catch (error) {
    console.error(`> Erro ao deletar file: ${error.message}`);
    return { success: false, error: error.message };
  }
};


