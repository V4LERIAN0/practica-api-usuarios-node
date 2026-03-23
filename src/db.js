// Importamos mysql2 que nos permite conectarnos a MySQL
import mysql from 'mysql2/promise';

// Importamos dotenv para cargar variables de entorno
import dotenv from 'dotenv';

dotenv.config();

// Creamos un pool de conexiones reutilizable
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});