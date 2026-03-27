// 250213V

import { dbModel } from "../..";


/**
 * Cria um provider.
 * @param {object} data - Dados para criação do provider.
 */
export const createProvider = async (data) => {
  const { user_id, bio } = data;

  if (bio.length > 256) console.warn("> [provider] Limite de caracteres na bio");
  data.bio = bio.substring(0, 256);

  try {
    const [provider, created] = await dbModel.providers.findOrCreate({ where: { user_id }, defaults: data });
    return { success: true, created, provider };
  } catch (error) {
    console.error(`> Erro ao criar provider: ${error.message}`);
    return { success: false, created: false, error: error.message };
  }
};


/**
 * Lê provider(s) com base no filtro.
 * Se options.single for true, retorna apenas um registro.
 * @param {object} filter - Critérios para a busca.
 * @param {object} options - Opções adicionais (ex.: { single: true }).
 */
export const readProvider = async (filter = {}, options = {}) => {
  try {
    if (options.single) {
      const provider = await dbModel.providers.findOne({ where: filter, ...options });
      return { success: !!provider, provider };
    } else {
      const providers = await dbModel.providers.findAll({ where: filter, ...options });
      return { success: !!providers, providers };
    }
  } catch (error) {
    console.error(`> Erro ao ler provider(s): ${error.message}`);
    return { success: false, error: error.message };
  }
};


/**
 * Atualiza provider(s) com base no filtro.
 * @param {object} filter - Critérios para atualização.
 * @param {object} newData - Dados novos para atualização.
 */
export const updateProvider = async (filter = {}, newData) => {
  try {
    const provider = await dbModel.providers.update(newData, { where: filter });
    return { success: !!provider, updated: provider[0], provider };
  } catch (error) {
    console.error(`> Erro ao atualizar provider: ${error.message}`);
    return { success: false, error: error.message };
  }
};


/**
 * Deleta provider(s) com base no filtro.
 * @param {object} filter - Critérios para deleção.
 */
export const deleteProvider = async (filter = {}) => {
  try {
    const deleted = await dbModel.providers.destroy({ where: filter });
    return { success: true, deleted };
  } catch (error) {
    console.error(`> Erro ao deletar provider: ${error.message}`);
    return { success: false, error: error.message };
  }
};
