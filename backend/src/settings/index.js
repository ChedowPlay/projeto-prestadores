import { env, envTest } from '../services/env';
import { welcome } from '../services/welcome';
import { rotinas } from '../cronjobs';
import moment from 'moment-timezone';
import express from 'express';
import cluster from 'cluster';
import os from 'os';


// Setups
import databaseSetup from './setups/database';
import security from './setups/security';
import links from './setups/links';


const numCPUs = os.cpus().length;


/**
 * Função geral de configuração do serverATP
 * @param {express} server 
 * @param {__dirname} PATH 
*/
const serverATP = async (server, PATH) => {
  try {
    if (!env.CLUSTERIZE) {
      console.time();
      console.clear();
    }


    // SETUPS - Ordem importa!
    // const sslOptions = ssl({ PATH });
    envTest({ callback: () => { throw new Error('Parando servidor...'); } });
    moment.tz.setDefault(env.TIMEZONE);
    security({ server });
    links({ server, PATH })
    await databaseSetup();
    rotinas();

    if (!env.CLUSTERIZE) {
      server.listen(env.PORT, env.HOST, () => welcome.msg());
      return false;
    }


    if (cluster.isPrimary) {
      console.log(`> Cluster mestre configurando ${numCPUs} workers...`);

      for (let i = 0; i < numCPUs; i++) cluster.fork();
      cluster.on('online', (worker) => console.log(`> Worker ${worker.process.pid} está online`));
      cluster.on('exit', (worker, code, signal) => {
        console.log(`> Worker ${worker.process.pid} morreu com o código ${code} e sinal ${signal}`);
        console.log('> Iniciando um novo worker');
        cluster.fork();
      });

    } else {

      const lnServer = server.listen(env.PORT, env.HOST, () => { console.log(`> Worker ${process.pid} iniciado`) });
      // const lnServer = spdy.createServer(sslOptions, server).listen(env.PORT, env.HOST, () => { console.log(`> Worker ${process.pid} iniciado`) });

      const events = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM']
      events.forEach((e) => {
        process.on(e, async () => {
          lnServer.close()
        })
      })
    }


    if (cluster.isPrimary && env.CLUSTERIZE) welcome.msg();
    if (!env.CLUSTERIZE) console.timeEnd();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};


export default serverATP;
