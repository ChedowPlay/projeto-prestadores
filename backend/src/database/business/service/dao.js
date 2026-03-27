// 250204V

import { dbModel } from "../..";


/**
 * Cria um service.
 * @param {object} data - Dados para criação do service.
 */
export const createService = async (data) => {
  const { title } = data;

  try {
    const [service, created] = await dbModel.services.findOrCreate({ where: { title }, defaults: data });
    return { success: true, created, service };
  } catch (error) {
    console.error(`> Erro ao criar service: ${error.message}`);
    return { success: false, created: false, error: error.message };
  }
};


/**
 * Lê service(s) com base no filtro.
 * @param {object} filter - Critérios para a busca.
 * @param {object} options - Opções adicionais (ex.: { single: true }).
 */
export const readService = async (filter = {}, options = {}) => {
  try {
    if (options.single) {
      const service = await dbModel.services.findOne({ where: filter, ...options });
      return { success: true, service };
    } else {
      const services = await dbModel.services.findAll({ where: filter, ...options });
      return { success: true, services };
    }
  } catch (error) {
    console.error(`> Erro ao ler service(s): ${error.message}`);
    return { success: false, error: error.message };
  }
};


/**
 * Atualiza service(s) com base no filtro.
 * @param {object} filter - Critérios para atualização.
 * @param {object} newData - Dados novos para atualização.
 */
export const updateService = async (filter = {}, newData) => {
  try {
    const result = await dbModel.services.update(newData, { where: filter });
    return { success: true, updated: result[0] };
  } catch (error) {
    console.error(`> Erro ao atualizar service: ${error.message}`);
    return { success: false, error: error.message };
  }
};


/**
 * Deleta service(s) com base no filtro.
 * @param {object} filter - Critérios para deleção.
 */
export const deleteService = async (filter = {}) => {
  try {
    const deleted = await dbModel.services.destroy({ where: filter });
    return { success: true, deleted };
  } catch (error) {
    console.error(`> Erro ao deletar service: ${error.message}`);
    return { success: false, error: error.message };
  }
};

