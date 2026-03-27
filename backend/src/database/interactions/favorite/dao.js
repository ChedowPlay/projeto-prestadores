// 250204V


import { Op, where } from "sequelize";
import { dbModel } from "../..";


/**
 * Cria um favorite.
 * @param {object} data - Dados para criação do favorite.
 */
export const createFavorite = async (data) => {
  const { user_id, favorited_id } = data;

  if (!user_id || !favorited_id) {
    console.error(`> Erro ao criar favorite: Dados inválidos.`);
    return { success: false, created: false, error: "Dados inválidos.", status: 400 };
  }

  try {
    const [favorite, created] = await dbModel.favorites.findOrCreate({
      where: { [Op.and]: [{ user_id }, { favorited_id }] },
      defaults: data,
    });
    return { success: !!favorite, created: created, favorite };
  } catch (error) {
    console.error(`> Erro ao criar favorite: ${error.message}`);
    return { success: false, created: false, error: error.message, status: 500 };
  }
};


/**
 * Lê favorite(s) com base no filtro.
 * @param {object} filter - Critérios para a busca.
 * @param {object} options - Opções adicionais (ex.: { single: true }).
 */
export const readFavorite = async (filter = {}, options = {}) => {
  try {
    if (options.single) {
      const favorite = await dbModel.favorites.findOne({ where: filter, ...options });
      return { success: true, favorite };
    } else {
      const favorites = await dbModel.favorites.findAll({ where: filter, ...options });
      return { success: true, favorites };
    }
  } catch (error) {
    console.error(`> Erro ao ler favorite(s): ${error.message}`);
    return { success: false, error: error.message };
  }
};


/**
 * Atualiza favorite(s) com base no filtro.
 * @param {object} filter - Critérios para atualização.
 * @param {object} newData - Dados novos para atualização.
 */
export const updateFavorite = async (filter = {}, newData) => {
  try {
    const result = await dbModel.favorites.update(newData, { where: filter });
    return { success: true, updated: result[0] };
  } catch (error) {
    console.error(`> Erro ao atualizar favorite: ${error.message}`);
    return { success: false, error: error.message };
  }
};


/**
 * Deleta favorite(s) com base no filtro.
 * @param {object} filter - Critérios para deleção.
 */
export const deleteFavorite = async (filter = {}) => {
  try {
    const deleted = await dbModel.favorites.destroy({ where: filter });
    return { success: true, deleted };
  } catch (error) {
    console.error(`> Erro ao deletar favorite: ${error.message}`);
    return { success: false, error: error.message };
  }
};
