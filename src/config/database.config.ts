import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const dbType = process.env.DB_TYPE as 'sqlite' | 'postgres';
  const isProduction = process.env.NODE_ENV === 'production';
  const useSSL = process.env.DB_SSL === 'true';

  const baseConfig = {
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: !isProduction,
  };

  if (dbType === 'sqlite') {
    return {
      ...baseConfig,
      type: 'sqlite',
      database: process.env.DB_DATABASE,
    };
  }

  return {
    ...baseConfig,
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  };
};