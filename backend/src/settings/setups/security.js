import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import requestIp from 'request-ip';
import cluster from 'cluster';
import helmet from 'helmet';
import cors from 'cors';

const security = ({ server, }) => {

  if (cluster.isPrimary) console.log('-- CONFIGURANDO CAMADA DE SEGURANÇA 👮‍♀️');
  server.set('trust proxy', 1);
  server.use(requestIp.mw());
  server.use(helmet({
    crossOriginResourcePolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "no-referrer" },
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    dnsPrefetchControl: false,
    expectCt: false,
    noSniff: true,
    hsts: true,
    xssFilter: false
  }));
  server.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
    maxAge: 86400
  }));


  // PARSERS
  if (cluster.isPrimary) console.log('-- CONFIGURANDO PARSERS 🍪');
  server.use(cookieParser());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json({}));

  return server
}

export default security;