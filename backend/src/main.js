import serverATP from './settings';
import express from "express";

// Não remover
import logger from './services/log';


const PATH = __dirname;
const server = express();


express.request.headers;
serverATP(server, PATH);
