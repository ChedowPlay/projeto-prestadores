import { slowDown } from 'express-slow-down';
import rateLimit from 'express-rate-limit';
import { time } from '../../services/time';
// https://www.npmjs.com/package/express-slow-down


/**
 * Função para limitar o acesso a uma determinada rota ou endpoint.
 * @param {Object} options - Objeto contendo as opções para limitar o acesso.
 * @param {number} options.max - O número máximo de solicitações permitidas dentro do intervalo de tempo.
 * @param {number} options.tempo - O intervalo de tempo em segundos durante o qual as solicitações serão contadas.
 * @returns {Function} - Middleware para limitar o acesso com base nas opções fornecidas.
 */
export const rateLimitSimple = ({
    max = 100,
    tempo = (15 * 60)
}) => (
    rateLimit({
        // validate: {
        //     trustProxy: false,
        //     xForwardedForHeader: false
        // },
        skipFailedRequests: true,
        windowMs: tempo * 1000,
        max: max,
        message: { error: `Muitas solicitações, aguarde ${tempo} segundos` },
        standardHeaders: false,
        legacyHeaders: false,
    })
);


/**
 * Middleware limitador de taxa que retarda as respostas em vez de bloqueá-las completamente. 
 * Use para retardar solicitações repetidas para APIs e/ou endpoints públicos, como redefinição de senha.
 * @param Object - Options
 * @param Options.tempo - Number: Tempo máx em segundos que a punição deve ficar
 * @param Options.delayAfter - Number: Aplicar a punição após X tentativas
 * @param Options.dalay - Number: Tempo de acréscimo na espera por punição
 * @returns The middleware that speed-limits clients based on your configuration.
 */
export const rateLimitWithSlow = ({
    tempo = (15 * 60), //15m
    max = 5,
    dalay = 100, //ms
}) => (
    slowDown({
        // validate: {
        //     trustProxy: false,
        //     xForwardedForHeader: false
        // },
        skipFailedRequests: true,
        windowMs: tempo * 1000, // 15 minutes
        delayAfter: max, // Allow 5 requests per 15 minutes.
        delayMs: (hits) => hits * dalay, // Add 100 ms of delay to every request after the 5th one.
    })
);


/**
 * Em desenvolvimento
 */
let ipDatabase = [];
const rateLimitWithBlock = (resp, reqs, {
    max = 5, // 5 solicitações
    tempo = 15 * 60, // 15 minutos
    blockTime = 24 * 60 * 60 * 1000 // 24 horas de bloqueio
}) => {
    const ip = reqs.clientIp;
    if (ipDatabase.includes(ip)) return resp.status(404).json({ error: 'bloquado' });

    return rateLimit({
        // validate: {
        //     trustProxy: false,
        //     xForwardedForHeader: false
        // },
        skipFailedRequests: true,
        windowMs: tempo * 1000,
        max: max,
        message: { error: `Muitas solicitações, aguarde ${tempo} segundos` },
        handler: (req, res, next) => {
            process.stderr.write(`[${time.getFormatedTime()}] taxas: ${req.rateLimit.remaining}` + ' IP: ' + req.clientIp + '\n');
            // Verifica se o IP atingiu o limite de solicitações
            if (req.rateLimit.remaining === 0) {
                // Aqui você pode adicionar a lógica para bloquear o IP
                process.stderr.write(`[${time.getFormatedTime()}] Bloqueando IP: ${ip}` + '\n');
                // Adicione o código para bloquear o IP (por exemplo, armazenando-o em um banco de dados)
                // Aqui estou apenas imprimindo uma mensagem, você precisa implementar a lógica de bloqueio real
                // Por exemplo, você pode armazenar o IP em um banco de dados e verificar se ele está bloqueado em cada solicitação

                ipDatabase.push(ip);
                return res.status(404).json({ error: 'bloquado' });
            }
            next();
        }
    })
};
