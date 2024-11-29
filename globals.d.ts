import type { Pool } from "mysql2/promise";

declare global {
    var _mysqlPool: Pool | undefined;
}

export {};