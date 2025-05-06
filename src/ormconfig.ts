// src/ormconfig.ts
import { DataSourceOptions } from 'typeorm';

export const ormConfig: DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "formdb",
    synchronize: true, // Auto create tables based on entities
    logging: true,
    entities: [__dirname + '/entity/*.ts'],
};
