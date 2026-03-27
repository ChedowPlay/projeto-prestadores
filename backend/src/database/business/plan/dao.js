// 250303V

import { dbModel } from "../..";

/**
 * Cria um file.
 * @param {object} data - Dados para criação do plan.
 */
export const createPlan = async (data) => {
  try {
    const [plan, created] = await dbModel.plans.findOrCreate({ where: { name: data?.name }, defaults: data });
    return { success: true, created, plan };
  } catch (error) {
    console.error(`> Erro ao criar plan: ${error.message}`);
    return { success: false, created: false, error: error.message };
  }
};

/**
 * Lê plan(s) com base no filtro.
 * @param {object} filter - Critérios para a busca.
 * @param {object} options - Opções adicionais (ex.: { single: true }).
 */
export const readPlan = async (filter = {}, options = {}) => {
  try {
    if (options.single) {
      const plan = await dbModel.plans.findOne({ where: filter, ...options });
      return { success: true, plan };
    } else {
      const plans = await dbModel.plans.findAll({ where: filter, ...options });
      return { success: !!plans, plans };
    }
  } catch (error) {
    console.error(`> Erro ao ler plan(s): ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza plan(s) com base no filtro.
 * @param {object} filter - Critérios para atualização.
 * @param {object} newData - Dados novos para atualização.
 */
export const updatePlan = async (filter = {}, newData) => {
  try {
    const result = await dbModel.plans.update(newData, { where: filter });
    return { success: true, updated: result[0] };
  } catch (error) {
    console.error(`> Erro ao atualizar plan: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Deleta plan(s) com base no filtro.
 * @param {object} filter - Critérios para deleção.
 */
export const deletePlan = async (filter = {}) => {
  try {
    const deleted = await dbModel.plans.destroy({ where: filter });
    return { success: true, deleted };
  } catch (error) {
    console.error(`> Erro ao deletar plan: ${error.message}`);
    return { success: false, error: error.message };
  }
};
