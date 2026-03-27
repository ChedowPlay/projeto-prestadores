// 250205V


import { API_LINK_PICTURE } from "../../../services/util";
import { dbModel } from "../..";
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';


// Função para criar um usuário com senha criptografada
export const createUser = async (data = {}) => {
    const { name, phone, picture_url, email, password } = data;


    if (!name || typeof name !== "string") {
        console.error("O valor 'name' (string) precisa ser declarado.");
        return { success: false, created: false, error: "O valor 'name' (string) precisa ser declarado." };
    }
    // if (!phone || typeof phone !== "string") {
    //     console.error("O valor 'phone' (string) precisa ser declarado.");
    //     return { success: false, error: "O valor 'phone' (string) precisa ser declarado." };
    // }
    const existingUser = await dbModel.users.findOne({ where: { email } });
    if (existingUser) return { success: false, created: false, error: "E-mail em uso." };

    if (!email || typeof email !== "string") {
        console.error("O valor 'email' (string) precisa ser declarado.");
        return { success: false, created: false, error: "O valor 'email' (string) precisa ser declarado." };
    }
    // if (!password || typeof password !== "string") {
    //     console.error("O valor 'password' (string) precisa ser declarado.");
    //     return { success: false, created: false, error: "O valor 'password' (string) precisa ser declarado." };
    // }

    // Adiciona um avatar padrão caso não tenha sido informado
    if (!picture_url || picture_url === "") data.picture_url = `${API_LINK_PICTURE}${name}`;

    try {
        const [user, created] = await dbModel.users.findOrCreate({ where: { email }, defaults: data });
        return { success: true, created, user };
    } catch (error) {
        console.error(`> Erro ao cadastrar o usuário: ${error.message}`, error);
        return { success: false, created: false, error: "Erro inesperado ao cadastrar o usuário." };
    }
};


// Função para buscar usuários
export const readUser = async (
    filter = {
        id: -1,
        email: "",
        include: null,
        attributes: ['user_id', 'name', 'phone', 'email', 'whatsapp', 'picture', 'cep']
    },
    options = { single: true }
) => {
    const { id, email, attributes, include } = filter;
    let whereCondition = {};

    if (id !== undefined && id !== -1) {
        whereCondition = { user_id: id };
    } else if (email && typeof email === 'string') {
        // Adapte a busca se necessário (por exemplo, utilizando lowercase)
        whereCondition = { email: email.toLowerCase() };
    }


    const myInclude = include || [{
        model: dbModel.providers,
        as: "provider",
        // attributes: ["provider_id", "bio", "deleted_at"]
    }];
    // console.log("myInclude:", JSON.stringify(myInclude, null, 2));


    try {
        if (options.single) {
            const user = await dbModel.users.findOne({ where: whereCondition, include: myInclude, attributes });
            return { success: !!user, user };
        } else {
            const users = await dbModel.users.findAll({ where: whereCondition, include: myInclude, attributes });
            return { success: true, users };
        }
    } catch (error) {
        console.warn(`> Erro ao buscar o usuário: ${error.message}`);
        return { success: false, error: 'Erro inesperado ao buscar o usuário.' };
    }
};



/**
 * Atualiza provider(s) com base no filtro.
 * @param {object} filter - Critérios para atualização.
 * @param {object} newData - Dados novos para atualização.
 */
export const updateUser = async (filter = {}, newData) => {
    try {
        const user = await dbModel.users.update(newData, { where: filter });
        return { success: !!user, updated: user[0], user };
    } catch (error) {
        console.error(`> Erro ao atualizar usuário: ${error.message}`);
        return { success: false, error: error.message };
    }
};


// Função para deletar usuário por ID
export const deleteUserById = async (id) => {
    if (!id || (typeof id !== 'number' && typeof id !== 'string')) {
        console.error("O valor 'id' precisa ser informado e ser um número ou string válido.");
        throw new Error("O valor 'id' precisa ser informado e ser um número ou string válido.");
    }
    try {
        const user = await dbModel.users.findByPk(id);
        if (!user) {
            console.warn(`> Usuário com ID ${id} não encontrado.`);
            return { success: false, error: `Usuário com ID ${id} não encontrado.` };
        }
        await user.destroy();
        return { success: true, message: `Usuário com ID ${id} deletado com sucesso.` };
    } catch (error) {
        console.error(`> Erro ao deletar o usuário: ${error.message}`);
        return { success: false, error: `Erro ao deletar o usuário: ${error.message}` };
    }
};


// Função para validar a senha
export const validatePassword = async ({ id, password }) => {
    try {
        const user = await dbModel.users.findByPk(id, { attributes: ['user_id', 'name', 'password'] });
        if (!user) {
            // console.error(`> Usuário com ID ${id} não encontrado.`);
            return { success: false, error: `Usuário não encontrado.` };
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            // console.log(`> Senha válida para o usuário ${user.name}`);
            return { success: true };
        } else {
            // console.warn(`> Senha inválida para o usuário ${user.name}`);
            return { success: false, error: `Senha inválida.` };
        }
    } catch (error) {
        // console.error(`> Erro ao validar senha: ${error.message}`);
        return { success: false, error: error.message };;
    }
};

