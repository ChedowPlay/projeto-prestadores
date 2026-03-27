// 250129V


import { time } from '../time';
import { env } from '../env';
import chalk from 'chalk';
import v8 from 'v8';


const atpVersion = env.VERSION || "noversion";


export const welcome = {
    msg() {
        const links = { app: "" }
        if (!env.URL) {
            links.web = `${chalk.bold.white('> Web:')} ${chalk.bold.blue.underline(`${env.PORT === 443 ? 'https' : 'http'}://${env.HOST}:${env.PORT}/`)}`;
            // links.app = `\n${chalk.bold.white('> App:')} ${chalk.bold.blue.underline(`exp://${env.HOST}:${env.APPPORT}/`)}`;
        } else {
            links.web = `${chalk.bold.white('> Web:')} ${env.URL}`;
            // links.app = ``;
        }

        console.log(`
            ${chalk.bold.blue(`d8888 88888888888 8888888b.  
           d88888     888     888   Y88b`)}
          ${chalk.bold.green(`d88P888     888     888    888 
         d88P 888     888     888   d88P`)}
        ${chalk.bold.yellow(`d88P  888     888     8888888P"  
       d88P   888     888     888`)}
      ${chalk.bold.magenta(`d8888888888     888     888        
     d88P     888     888     888
`)}
${chalk.bold.blue(' ─────────────────────────────────────────── ')}
${chalk.bold.green('              SERVIDOR: ON 😎            ')}
${chalk.bold.magenta('          Developed by Lucas ATS            ')}
${chalk.bold.italic(`ATP VERSION: ${atpVersion} - diboa club edition`)}

${chalk.italic.white(`[${time.getFormatedTime()}] ${env.DEBUG ? ('DEBUG ON') : ''}`)}
${links.web} ${links.app}
${chalk.bold.blue(' ─────────────────────────────────────────── ')}`);

        const heapStatistics = v8.getHeapStatistics();
        console.log(`   Limite de tamanho de heap: ${(heapStatistics.heap_size_limit / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Tamanho total do heap: ${(heapStatistics.total_heap_size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Tamanho de heap usado: ${(heapStatistics.used_heap_size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Tamanho de heap disponível: ${((heapStatistics.heap_size_limit - heapStatistics.used_heap_size) / 1024 / 1024).toFixed(2)} MB`);
        console.log(chalk.bold.blue(' ─────────────────────────────────────────── '));

    }
}