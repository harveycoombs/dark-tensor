"use server";
import pool from "@/lib/database";
import { generateHash, verify } from "@/lib/passwords";

export async function createUser(email: string, password: string, firstName: string, lastName: string): Promise<string> {
    const passwordHash = await generateHash(password);
    const result = await pool.query("INSERT INTO darktensor.users (user_id, creation_date, email_address, password, first_name, last_name) VALUES (gen_random_uuid(), NOW(), $1, $2, $3, $4) RETURNING user_id", [email, passwordHash, firstName, lastName]);
    
    return result.rows[0]?.user_id ?? "";
}

export async function updateUser(userid: string, firstName: string, lastName: string, occupation: string, emailAddress: string): Promise<boolean> {
    const result = await pool.query("UPDATE darktensor.users SET first_name = $1, last_name = $2, occupation = $3, email_address = $4 WHERE user_id = $5", [firstName, lastName, occupation, emailAddress, userid]);
    return (result.rowCount ?? 0) > 0;
}

export async function updateSettings(userid: string, theme: string, model: string, visionModel: string, style: string): Promise<boolean> {
    const result = await pool.query("UPDATE darktensor.settings SET theme = $1, model = $2, vision_model = $3, style = $4 WHERE user_id = $5", [theme, model, visionModel, style, userid]);
    return (result.rowCount ?? 0) > 0;
}

export async function deleteUser(userid: string): Promise<boolean> {
    const result = await pool.query("UPDATE darktensor.users SET deleted = true WHERE user_id = $1", [userid]);
    return (result.rowCount ?? 0) > 0;
}

export async function getUserByID(userid: string): Promise<any> {
    const result = await pool.query("SELECT darktensor.users.user_id, creation_date, first_name, last_name, darktensor.settings.model, darktensor.settings.vision_model FROM darktensor.users INNER JOIN darktensor.settings ON darktensor.settings.user_id = darktensor.users.user_id WHERE darktensor.users.user_id = $1 AND deleted = false", [userid]);
    return result.rows[0];
}

export async function getUserDetails(userid: string): Promise<any> {
    const result = await pool.query("SELECT user_id, creation_date, email_address, first_name, last_name, occupation FROM darktensor.users WHERE user_id = $1 AND deleted = false", [userid]);
    return result.rows[0];
}

export async function getUserSettings(userid: string): Promise<any> {
    const result = await pool.query("SELECT * FROM darktensor.settings WHERE user_id = $1", [userid]);
    return result.rows[0];
}

export async function getUserByEmailAddress(email: string): Promise<any> {
    const result = await pool.query("SELECT user_id, first_name, last_name FROM darktensor.users WHERE email_address = $1 AND deleted = false", [email]);
    return result.rows[0];
}

export async function getPasswordHash(email: string): Promise<string> {
    const result = await pool.query("SELECT password AS password FROM darktensor.users WHERE email_address = $1", [email]);
    return result.rows[0]?.password;
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
    const hash = await getPasswordHash(email);

    if (!hash?.length) return false;

    const valid = await verify(password, hash);
    return valid;
}

export async function emailExists(email: string, userid: string=""): Promise<boolean> {
    const filter = userid?.length ? " AND user_id <> $2" : "";
    const params = userid?.length ? [email, userid] : [email];

    const result = await pool.query(`SELECT COUNT(*) AS total FROM darktensor.users WHERE email_address = $1${filter}`, params);
    return parseInt(result.rows[0].total) > 0;
}

export async function getSearchHistory(userid: string, limit: number): Promise<any[]> {
    const result = await pool.query("SELECT * FROM darktensor.searches WHERE user_id = $1 ORDER BY search_date DESC LIMIT $2", [userid, limit]);
    return result.rows;
}

export async function insertSearchHistory(userid: string, query: string): Promise<boolean> {
    const result = await pool.query("INSERT INTO darktensor.searches (user_id, search_date, query) VALUES ($1, NOW(), $2)", [userid, query]);
    return (result.rowCount ?? 0) > 0;
}

export async function insertImageSearchHistory(userid: string): Promise<number> {
    const result = await pool.query("INSERT INTO darktensor.image_searches (user_id, search_date) VALUES ($1, NOW()) RETURNING image_search_id", [userid]);
    return result.rows[0]?.image_search_id ?? 0;
}