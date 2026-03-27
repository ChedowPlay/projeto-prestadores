// 250129V

import { jobRemoverTokensVencidos } from "./jobs/token";
import { jobRemoverOTPsVencidos } from "./jobs/otp";
import { jobRemoverArquivos } from "./jobs/album";


import cluster from 'cluster';


const jobsArray = [
    jobRemoverTokensVencidos,
    jobRemoverOTPsVencidos,
    jobRemoverArquivos,
];


export const rotinas = () => {
    if (cluster.isPrimary) console.log('-- INICIANDO CRON-JOBS 📆');
    
    try {
        let analise = 0;


        jobsArray.map((job) => {
            analise += job();
        });


        if (analise !== jobsArray.length) throw 'Um ou mais cron-jobs falharam.';
    } catch (error) {
        console.error('> CronJobs Error:', error);
        return false;
    }
}