// 250203V

import { env } from '../../../services/env';
import { dbModel } from '../..';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';


const SECRET_KEY = env.SECRETKEY;
const TOKEN_EXPIRES = 7 * 24 * 60 * 60; // 7 dias em segundos


// Função para criar um token JWT baseado no ID do usuário
export const createToken = async (data = { user_id: "", access: null, tokenExpires: TOKEN_EXPIRES }) => {
    const { user_id, access, tokenExpires } = data;

    if (!user_id || (typeof user_id !== 'number' && typeof user_id !== 'string')) {
        console.error("O valor 'user_id' precisa ser informado e ser um número ou string válido.");
        return { success: false, error: "O valor 'user_id' precisa ser informado e ser um número ou string válido." };
    }

    const expiresIn = Math.floor(Date.now() / 1000) + (tokenExpires || TOKEN_EXPIRES); // Timestamp 1h
    const expiresInGMT = new Date(expiresIn * 1000); // Converte para GMT
    try {
        const token = jwt.sign({ user_id, exp: expiresIn }, SECRET_KEY, { algorithm: "HS256" });
        
        const resume = await dbModel.tokens.create({ user_id, access, code: token, expires_at: expiresInGMT });
        return { success: true, code: resume.code, expires_at: expiresInGMT };
    } catch (error) {
        console.error(`> Error ao cadastrar o token: ${error.message}`);
        return { success: false, error: "Erro inesperado ao cadastrar o token." };
    }
};


// Função para validar um token
export const validateToken = async (code) => {
    if (!code || typeof code !== "string") {
        console.error("O valor 'token' (string) precisa ser declarado.");
        return { success: false, error: "O valor 'token' (string) precisa ser declarado." };
    }
    try {
        const tokenRecord = await dbModel.tokens.findOne({ where: { code }, attributes: ["token_id", "code", "access", "expires_at"] });
        if (!tokenRecord) return { success: false, error: "Sessão não encontrado ou expirado." };
        if (new Date() > new Date(tokenRecord.expiresin)) {
            await tokenRecord.destroy();
            return { success: false, error: "Sessão expirada faça o login novamente." };
        }
        const decoded = jwt.verify(code, SECRET_KEY);
        return { success: true, decoded };
    } catch (error) {
        console.error(`> Erro ao validar o token: ${error.message}`);
        return { success: false, error: "Sessão inválido ou expirada." };
    }
};


// Remove tokens com data de expiração menor que a data atual
export const removeExpiredTokens = async () => {
    try {
        return await dbModel.tokens.destroy({ where: { expires_at: { [Op.lt]: new Date() } } });
    } catch (error) {
        console.error('> Error <token DAO>: Não foi possível remover os tokens vencidos:', error);
        return null;
    }
}


// Função para deletar token pelo ID
export const deleteToken = async (data = { token_id: false, code: "" }) => {
    const { token_id, code } = data;

    let whereCondition = {};
    if (token_id && (typeof token_id === 'number' || typeof token_id === 'string')) whereCondition.token_id = token_id;
    else if (code && typeof code === 'string') whereCondition.code = code;

    try {
        const data = await dbModel.tokens.findOne({ where: whereCondition, attributes: ["token_id", "code", "access", "expires_at"] });
        // console.log(JSON.stringify(data, null, 2));
        if (!data) {
            console.warn(`> Token com ID ${token_id} não encontrado.`);
            return { success: false, error: `Token com ID ${token_id} não encontrado.` };
        }
        const deleted = await data.destroy();
        return { success: true, message: `Token com ID ${token_id} deletado com sucesso.`, data, deleted };
    } catch (error) {
        console.error(`> Erro ao deletar o token: ${error.message}`);
        return { success: false, error: `Erro ao deletar o token: ${error.message}` };
    }
};
