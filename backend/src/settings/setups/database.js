// 250204V


import { db, dbConfigPostgres, dbConfigSqliteTest } from '../../database';
import { env } from '../../services/env';
import { insert } from '../../insert';
import { testes } from '../../tests';
import cluster from 'cluster';


const FORSE_PROD = true;


const databaseSetup = async () => {
    if (cluster.isPrimary) {
        try {
            // BANCO DE TESTES
            console.log('-- CONECTANDO COM BANCO DE TESTES 🏦🔧');
            const dbTestInstance = db(dbConfigSqliteTest);
            await dbTestInstance.sync({ force: true });

            // REALIZA TESTES NO BANCO DE DADOS
            console.log('-- INICIANDO TESTES NO BANCO');
            const myTestes = await testes();
            await dbTestInstance.close();

            if (!myTestes) {
                throw new Error('TESTES NÃO PASSARAM, ENCERRANDO SISTEMA');
            }


            // BANCO DE PRODUÇÃO
            console.log('-- CONECTANDO COM BANCO DE PRODUÇÃO 🏦');
            if (env.DEBUG) {
                FORSE_PROD && console.log('⚠️  A opção Force está ativa para o db de produção ⚠️');
                if (env.DB_DIALECT === "sqlite") await db().sync(true);
                else await db(dbConfigPostgres).sync(true);
            } else {
                // await db().sync(false);
                await db(dbConfigPostgres).sync(false);
            }


            // INJETA INFORMAÇÕES NECESSÁRIAS
            console.log('-- INSERINDO DADOS NECESSÁRIOS AO BANCO DE DADOS 💉');
            await insert();

        } catch (error) {
            console.error('Erro na configuração do banco de dados:', error);
            process.exit(1); // Encerra o processo se ocorrer um erro
        }
    } else {
        await db().sync();
    }
};

export default databaseSetup;
