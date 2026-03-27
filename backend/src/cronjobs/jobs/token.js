import { removeExpiredTokens } from '../../database/auth/token/dao';
import { time } from '../../services/time';
import { env } from '../../services/env';
import { schedule } from 'node-cron';


/**
 * Realizar varredura a cada hora para remover tokens vencidos.
 * @returns boolean
*/
export const jobRemoverTokensVencidos = () => {
    try {
        // schedule('*/1 * * * *', async () => { // 1m
            schedule('0 */24 * * *', async () => { // 24h
            const value = await removeExpiredTokens();
            console.log(`> CronJob: [${time.getFormatedTime()}] Quantidade de tokens vencidos removidos ${value}`);
        }, {
            scheduled: true,
            timezone: env.TIMEZONE,
        });

        return true;
    } catch (error) {
        console.error('> CronJob: Falha na rotina de remover tokens vencidos:', error);
        return false;
    }
}