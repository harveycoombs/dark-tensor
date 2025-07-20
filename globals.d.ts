import type { Pool } from "pg";

declare global {
    var _pgPool: Pool|undefined;
}

export {};