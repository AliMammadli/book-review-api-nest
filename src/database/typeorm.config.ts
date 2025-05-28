import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production.local'
  : '.env.development.local';

config({ path: path.resolve(process.cwd(), envFile) });

const dbType = process.env.DB_TYPE as 'sqlite' | 'postgres';
const useSSL = process.env.DB_SSL === 'true';

const baseConfig = {
  entities: ['src/**/*.entity{.ts,.js}'],
  migrationsTableName: 'migrations',
};

const dataSource: DataSourceOptions = dbType === 'sqlite'
  ? {
    ...baseConfig,
    type: 'sqlite',
    database: process.env.DB_DATABASE,
    migrations: ['src/database/migrations/*.sqlite.ts'],
  }
  : {
    ...baseConfig,
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
    migrations: ['src/database/migrations/*.postgres.ts'],
  };

export default new DataSource(dataSource);