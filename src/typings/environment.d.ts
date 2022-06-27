import { Dialect } from 'sequelize/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      POSTGRES_USERNAME: string;
      POSTGRES_DB_DEVELOPMENT: string;
      POSTGRES_DB_PRODUCTION: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: number;
      POSTGRES_DIALECT: Dialect;
      JWT_SECRET: string;
    }
  }
}

export {};
