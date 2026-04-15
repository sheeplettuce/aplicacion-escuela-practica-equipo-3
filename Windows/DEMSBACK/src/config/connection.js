import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

export const getConnection = async () => {
    console.log('Dotenv: ', process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE, process.env.DB_SERVER, process.env.DB_PORT);
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error('Error de conexión a SQL Server:', error);
        throw error;
    }
};

export { sql };