// 250210V


const { z } = require('zod');
require('dotenv/config');


// Define o schema das variáveis de ambiente usando Zod
const schema = z.object({
    VERSION: z.coerce.string().optional(),
    // VERSIONAPP: z.coerce.string(),
    // APPPORT: z.coerce.number(),


    // SERVIDOR
    PORT: z.coerce.number(),
    HOST: z.string().refine(value => {
        if (value.toLowerCase() === 'localhost') return true;
        const ipRegex = /^\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b$/;
        return ipRegex.test(value);
    }, { message: 'env>HOST: Deve ser um IP válido ou "localhost"' }),
    URL: z.string().refine(value => {
        if (value.toLowerCase() === 'null') return true;
        const urlRegex = /^(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+|https?:\/\/(?:\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[^\s]*)?$/;
        return urlRegex.test(value);
    }, { message: 'env>URL: Deve ser uma URL válida "https://www.site.com.br" ou "null"' }).transform(value => {
        return value.toLowerCase() === 'null' ? null : value;
    }),


    // GERAL
    DEBUG: z.string().refine(value => {
        const validValues = ['true', 'false', "1", "0"];
        return validValues.includes(value);
    }, { message: 'env>DEBUG: Deve ser "true", "false", 1 ou 0' }).transform(value => {
        if (value === 'true' || value === "1") return true;
        if (value === 'false' || value === "0") return false;
    }),
    CLUSTERIZE: z.string().refine(value => {
        const validValues = ['true', 'false', "1", "0"];
        return validValues.includes(value);
    }, { message: 'env>DEBUG: Deve ser "true", "false", 1 ou 0' }).transform(value => {
        if (value === 'true' || value === "1") return true;
        if (value === 'false' || value === "0") return false;
    }),
    SECRETKEY: z.coerce.string(),
    TIMEZONE: z.coerce.string(),
    PATH_LOG: z.coerce.string(),
    PROFILE_PIC_API: z.coerce.string().url().default("https://api.dicebear.com/9.x/initials/png?seed="),


    // AUTH SYSTEM
    // GOOGLE_CLIENT_ID: z.coerce.string().optional(),
    // GOOGLE_CLIENT_SECRET: z.coerce.string().optional(),
    // FACEBOOK_API_URL: z.coerce.string().url().optional(),
    // FACEBOOK_APP_ID: z.coerce.string().optional(),
    // FACEBOOK_APP_SECRET: z.coerce.string().optional(),

    // MERCADO PAGO
    MP_CLIENT_SECRET: z.coerce.string().optional(),
    MP_BACK_SUCCESS: z.coerce.string().url(),
    MP_BACK_FAILURE: z.coerce.string().url(),
    MP_BACK_PENDING: z.coerce.string().url(),


    // REDIS
    REDIS_HOST: z.coerce.string().optional(),
    REDIS_PORT: z.coerce.number().optional(),


    // BANCO DE DADOS
    // # DEV
    DB_TEST_DIALECT: z.coerce.string(),
    DATABASE_TEST: z.coerce.string(),


    // # PROD
    DB_DIALECT: z.coerce.string(),
    DATABASE: z.coerce.string(),
    DB_HOST: z.coerce.string().optional(),
    DB_PORT: z.coerce.number().optional(),
    DB_USERNAME: z.coerce.string().optional(),
    DB_PASSWORD: z.coerce.string().optional(),
    DB_SSL: z.coerce.boolean().default(true),


    // EMAIL
    SEND_EMAILS: z.coerce.boolean(),
    EMAIL_SMTP_HOST: z.coerce.string(),
    EMAIL_SMTP_PORT: z.coerce.number(),
    EMAIL_SERVICE: z.coerce.string(),
    EMAIL_USER: z.coerce.string().email(),
    EMAIL_PASS: z.coerce.string(),
});


/**
 * Função para validar as variáveis de ambiente do arquivo .env
 * @param {Function} callback - Função de callback para lidar com erros
 * @returns {Error|undefined} - Retorna um erro se houver problemas com as variáveis de ambiente
 */
exports.envTest = function ({ callback }) {
    try {
        var getEnv = schema.safeParse(process.env);

        if (!getEnv.success) {
            var errorMsg = '🔴 Erro no arquivo dotenv:';
            console.error(errorMsg, getEnv.error.format());
            throw new Error(errorMsg);
        } else {
            return getEnv.data;
        }
    } catch (error) {
        callback();
        return error;
    }
};



exports.env = schema.safeParse(process.env).data;