import "server-only";
import { Pool } from "pg";

let pool: Pool;

if (!globalThis._pgPool) {
    console.log("PostgreSQL database connection established successfully.");

    globalThis._pgPool = new Pool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMA,
        max: 100,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
}

pool = globalThis._pgPool;

export default pool;