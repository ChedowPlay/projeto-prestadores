// 250305V


import { modelDefiners } from './modelDefiners.js';
import { relationship } from './relationship.js';
import { env } from '../services/env/index.js';
import { Sequelize } from 'sequelize';
import 'dotenv/config';


const define = {
  charset: 'utf8',
  collate: 'utf8_general_ci',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};


export const dbConfigSqlite = {
  dialect: env.DB_DIALECT,
  storage: env.DATABASE,
  logging: false,
  define: define,
}


export const dbConfigSqliteTest = {
  dialect: env.DB_TEST_DIALECT,
  storage: env.DATABASE_TEST,
  logging: false,
  define: define,
}



// MSSQL
export const dbConfigMssql = {
  dialect: env.DB_DIALECT,
  host: env.DB_HOST,
  port: env.DB_PORT,
  pool: {
    max: 8,         // Número máximo de conexões simultâneas
    min: 0,         // Número mínimo de conexões
    acquire: 30000, // Tempo máximo para obter uma conexão
    idle: 10000,    // Tempo antes de liberar uma conexão inativa
  },
  database: env.DATABASE,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  logging: false,
  dialectOptions: {
    options: {
      encrypt: false,
      requestTimeout: 30000, // Tempo limite da requisição
    },
  },
};


// PostgreSQL
export const dbConfigPostgres = {
  dialect: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT || 5432,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DATABASE,
  logging: false,
  define: define,
  dialectOptions: {
    ssl: env.DB_SSL ? { require: true, rejectUnauthorized: false } : false,
  },
};


export let dbModel = null;


export const db = (config = dbConfigSqlite) => {
  const sequelizeInstance = new Sequelize(config);
  dbModel = sequelizeInstance.models;
  setupDatabase(sequelizeInstance);

  return sequelizeInstance;
}


const setupDatabase = async (db) => {
  await modelDefiners(db);
  await relationship();
};
