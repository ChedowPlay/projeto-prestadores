// 250213V

import { Op, where } from "sequelize";
import { dbModel } from "../..";



/**
 * Cria uma complaint.
 * @param {object} data - Dados para criação da complaint.
 */
export const createComplaint = async (data) => {
  const { user_id, provider_id } = data;
  // console.log(JSON.stringify(data, null, 2));

  if (!provider_id) {
    console.error(`> Erro ao criar complaint: provider_id inválidos.`);
    return { success: false, created: false, error: "provider_id inválido.", status: 400 };
  }

  const where = { [Op.or]: [] };
  // if (user_id) where[Op.or].push({ user_id });
  // if (provider_id) where[Op.or].push({ provider_id });

  try {
    const [complaint, created] = await dbModel.complaints.findOrCreate({ where, defaults: data });
    return { success: !!complaint, created: created, complaint };
  } catch (error) {
    console.error(`> Erro ao criar complaint: ${error.message}`);
    return { success: false, created: false, error: error.message };
  }
};


/**
 * Lê complaint(s) com base no filtro.
 * @param {object} filter - Critérios para a busca.
 * @param {object} options - Opções adicionais (ex.: { single: true }).
 */
export const readComplaint = async (filter = {}, options = {}) => {
  try {
    if (options.single) {
      const complaint = await dbModel.complaints.findOne({ where: filter, ...options });
      return { success: true, complaint };
    } else {
      const complaints = await dbModel.complaints.findAll({ where: filter, ...options });
      return { success: true, complaints };
    }
  } catch (error) {
    console.error(`> Erro ao ler complaint(s): ${error.message}`);
    return { success: false, error: error.message };
  }
};


/**
 * Atualiza complaint(s) com base no filtro.
 * @param {object} filter - Critérios para atualização.
 * @param {object} newData - Dados novos para atualização.
 */
export const updateComplaint = async (filter = {}, newData) => {
  try {
    const result = await dbModel.complaints.update(newData, { where: filter });
    return { success: true, updated: result[0] };
  } catch (error) {
    console.error(`> Erro ao atualizar complaint: ${error.message}`);
    return { success: false, error: error.message };
  }
};


/**
 * Deleta complaint(s) com base no filtro.
 * @param {object} filter - Critérios para deleção.
 */
export const deleteComplaint = async (filter = {}) => {
  try {
    const deleted = await dbModel.complaints.destroy({ where: filter });
    return { success: true, deleted };
  } catch (error) {
    console.error(`> Erro ao deletar complaint: ${error.message}`);
    return { success: false, error: error.message };
  }
};



