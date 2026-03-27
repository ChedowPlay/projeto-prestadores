import { env } from '../../services/env';
import compression from 'compression';
import urls from '../../routes';
import express from 'express';
import cluster from 'cluster';


const links = ({ server, PATH }) => {
    const staticPath = PATH + '/public/static';
    const midiaPath = PATH + '/public/media';


    // CONFIGURA STATUS DEBUG E PATHs
    if (cluster.isPrimary) console.log('-- CONFIGURANDO STATUS DEBUG 🐞 E PATHs 📁');
    server.use((req, res, next) => {
        req.static_path = staticPath;
        req.midia_path = midiaPath;
        req.status_debug = env.DEBUG;
        next();
    });


    // LIBERANDO ROTAS
    if (cluster.isPrimary) console.log('-- LIBERANDO AS PASTAS ESTÁTICAS E PÚBLICAS 🌎');
    server.use('/static', express.static(staticPath));
    server.use('/media', express.static(midiaPath));


    // URLS - Views e APIs
    if (cluster.isPrimary) console.log('-- CONFIGURANDO URLs 🔗');
    server.use(compression());
    new urls(server);


    return server
}

export default links;