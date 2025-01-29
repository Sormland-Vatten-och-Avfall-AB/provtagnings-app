// src/ormconfig.ts
import { DataSourceOptions } from 'typeorm';

export const ormConfig: DataSourceOptions = {
    type: "postgres", // Ensure this is set correctly
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "formdb",
    synchronize: true, // Auto create tables based on entities
    logging: true,     // Corrected from loggin to logging
    entities: [__dirname + '/entity/*.ts'], // Adjust the path as needed
};
