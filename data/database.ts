import "server-only";
import mysql, { Pool } from "mysql2/promise";

let pool: Pool;

if (!globalThis._mysqlPool) {
    console.log("Database Connection Established Successfully");

    globalThis._mysqlPool = mysql.createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMA,
        connectionLimit: 100,
        queueLimit: 0,
        waitForConnections: true
    });
}

pool = globalThis._mysqlPool;

export default pool;