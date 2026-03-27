import { removeExpiredOTPs } from '../../database/auth/otp/dao'; 
import { time } from '../../services/time';
import { env } from '../../services/env';
import { schedule } from 'node-cron';


/**
 * Realizar varredura a cada hora para remover tokens vencidos.
 * @returns boolean
*/
export const jobRemoverOTPsVencidos = () => {
    try {
        // schedule('*/1 * * * *', async () => { // 1m
            schedule('0 */24 * * *', async () => { // 24h
            const value = await removeExpiredOTPs();
            console.log(`> CronJob: [${time.getFormatedTime()}] Quantidade de OTPs vencidos removidos ${value}`);
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