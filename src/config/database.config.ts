import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const dbType = process.env.DB_TYPE as 'sqlite' | 'postgres';

  const baseConfig = {
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  };

  if (dbType === 'sqlite') {
    return {
      ...baseConfig,
      type: 'sqlite',
      database: process.env.DB_DATABASE || './data/database.sqlite',
    };
  }

  return {
    ...baseConfig,
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
};