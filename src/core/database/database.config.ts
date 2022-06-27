import { config } from 'dotenv';
import { IDatabaseConfig } from '../../typings/dbConfig';

config();

const databaseConfig: IDatabaseConfig = {
  development: {
    username: process.env.POSTGRES_USERNAME,
    database: process.env.POSTGRES_DB_DEVELOPMENT,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: process.env.POSTGRES_DIALECT,
  },
  production: {
    username: process.env.POSTGRES_USERNAME,
    database: process.env.POSTGRES_DB_PRODUCTION,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: process.env.POSTGRES_DIALECT,
  },
};

export { databaseConfig };
