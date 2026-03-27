// 250210V


import { dbModel } from "../..";
import { Op } from "sequelize";
import bcrypt from 'bcrypt';


// Tempo de espera entre a criação de um OTP e outro (em segundos).
const OTP_WAIT_MINUTES = 2 * 60;

// Tempo de validação do OTP (em minutos).
const OTP_VALIDITY_MINUTES = 15;

// Número máximo de tentativas de validação do OTP.
const OTP_MAX_ATTEMPTS = 3;


/**
 * Função para gerar um código OTP aleatório (6 caracteres alfanuméricos)
 */
const generateOTPCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};


/**
 * Cria um OTP para o usuário.
 * @param {object} data - Objeto contendo user_id e objective.
 * @returns {object} - Resultado da operação.
 */
export const createOTP = async (data = { user_id: "", objective: "" }) => {
    const { user_id, objective } = data;

    if (!user_id) {
        console.error("O valor 'user_id' precisa ser informado.");
        return { success: false, status: 400, error: "O valor 'user_id' precisa ser informado." };
    }
    if (!objective) {
        console.error("O valor 'objective' precisa ser informado.");
        return { success: false, status: 400, error: "O valor 'objective' precisa ser informado." };
    }

    // Verifica se já existe um OTP recente
    const otpRecord = await dbModel.otps.findOne({ where: { user_id }, order: [["created_at", "DESC"]] });

    if (otpRecord) {
        const createdAt = new Date(otpRecord.created_at);
        const now = new Date();
        const diffMs = now - createdAt;
        const diffSeconds = Math.floor(diffMs / 1000);

        // console.log(">>> ", diffMs, (OTP_WAIT_MINUTES * 1000), (diffMs < (OTP_WAIT_MINUTES * 1000)));

        if (diffMs < (OTP_WAIT_MINUTES * 1000)) {
            return {
                status: 429,
                success: false,
                error: `Aguarde ${OTP_WAIT_MINUTES - diffSeconds} segundos para enviar um novo código de segurança.`,
            };
        }

        // Remove o OTP anterior caso o tempo já tenha passado
        await otpRecord.destroy();
    }

    const otpCode = generateOTPCode();
    const expiresAt = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000);

    try {
        const otp = await dbModel.otps.create({
            user_id,
            objective,
            code: otpCode,
            attempts: 0,
            expires_at: expiresAt,
        });

        return { success: true, otp, code: otpCode };
    } catch (error) {
        console.error(`> Erro ao criar OTP: ${error.message}`);
        return { success: false, error: "Erro inesperado ao criar OTP." };
    }
};



/**
 * Valida um OTP.
 * A cada tentativa, o campo attempts é incrementado. Se atingir 3 tentativas ou se o OTP estiver expirado, ele é removido.
 * @param {object} param0 - Objeto contendo user_id e code.
 * @returns {object} - Resultado da validação.
 */
export const validateOTP = async ({ user_id, code }) => {
    if (!user_id) {
        console.error("O valor 'user_id' precisa ser informado.");
        return { success: false, error: "O valor 'user_id' precisa ser informado." };
    }
    if (!code) {
        console.error("O valor 'code' precisa ser informado.");
        return { success: false, error: "O valor 'code' precisa ser informado." };
    }
    try {
        // Busca o OTP associado ao usuário (poderia ser ajustado para buscar pelo código também, se necessário)
        const otpRecord = await dbModel.otps.findOne({ where: { user_id } });
        if (!otpRecord) return { success: false, error: "Código não encontrado." };


        // Verifica se o OTP expirou
        if (new Date() > new Date(otpRecord.expires_at)) {
            await otpRecord.destroy();
            return { success: false, error: "Código expirado." };
        }

        // Se o código não confere
        const isValid = await bcrypt.compare(code, otpRecord.code);
        // console.log(otpRecord.code, code, isValid);
        if (!isValid) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            // console.log("attempts:", otpRecord.attempts, otpRecord.attempts >= OTP_MAX_ATTEMPTS);

            if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
                // console.log("Deletando por excesso de attempts");
                await otpRecord.destroy();
                return { success: false, error: "Número de tentativas atingido. Solicite um novo código." };
            }
            // console.log(code, otpRecord.code);
            return { success: false, error: "Código incorreto." };
        }

        await otpRecord.destroy();
        return { success: true, message: "Código validado com sucesso." };
    } catch (error) {
        console.error(`> Erro ao validar OTP: ${error.message}`);
        return { success: false, error: "Erro inesperado." };
    }
};


/**
 * Deleta um OTP baseado no otp_id ou code.
 * @param {object} data - Objeto contendo otp_id ou code.
 * @returns {object} - Resultado da operação.
 */
export const deleteOTP = async (data = { otp_id: null, user_id: null, code: "" }) => {
    const { otp_id, user_id, code } = data;
    let whereCondition = {};
    if (otp_id) whereCondition.otp_id = otp_id;
    if (user_id) whereCondition.user_id = user_id;
    if (code) whereCondition.code = code;
    try {
        const otpRecord = await dbModel.otps.findOne({ where: whereCondition });
        if (!otpRecord) {
            console.warn("> OTP não encontrado para os parâmetros fornecidos.");
            return { success: false, error: "Código não encontrado." };
        }
        await otpRecord.destroy();
        return { success: true, message: "Código deletado com sucesso." };
    } catch (error) {
        console.error(`> Erro ao deletar OTP: ${error.message}`);
        return { success: false, error: `Erro ao deletar Código: ${error.message}` };
    }
};


/**
 * Remove todos os OTPs expirados (com expires_at menor que a data atual).
 * @returns {number|null} - Número de registros deletados ou null em caso de erro.
 */
export const removeExpiredOTPs = async () => {
    try {
        return await dbModel.otps.destroy({ where: { expires_at: { [Op.lt]: new Date() } } });
    } catch (error) {
        console.error("> Erro ao remover OTPs expirados:", error);
        return null;
    }
};
