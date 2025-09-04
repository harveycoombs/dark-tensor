"use server";
import pool from "@/lib/database";
import { generateHash, verify } from "@/lib/passwords";
import { generate } from "@/lib/model";

export async function createUser(email: string, password: string, firstName: string, lastName: string, birthdate: string): Promise<number> {
    const passwordHash = await generateHash(password);
    const result = await pool.query("INSERT INTO users (creation_date, email_address, password_hash, first_name, last_name, birth_date) VALUES (NOW(), $1, $2, $3, $4, $5) RETURNING user_id", [email, passwordHash, firstName, lastName, birthdate]);
    
    return result.rows[0]?.user_id ?? 0;
}

export async function updateUser(userid: number, firstName: string, lastName: string, location: string, birthDate: Date, gender: string, occupation: string, emailAddress: string): Promise<boolean> {
    const result = await pool.query("UPDATE users SET first_name = $1, last_name = $2, location = $3, birth_date = $4, gender = $5, occupation = $6, email_address = $7 WHERE user_id = $8", [firstName, lastName, location, birthDate, gender, occupation, emailAddress, userid]);
    return (result.rowCount ?? 0) > 0;
}

export async function updateSettings(userid: number, theme: string, searchModel: string, chatModel: string, visionModel: string, summaryStyle: string, chatStyle: string): Promise<boolean> {
    const result = await pool.query("UPDATE settings SET theme = $1, search_model = $2, chat_model = $3, vision_model = $4, summary_style = $5, chat_style = $6 WHERE user_id = $7", [theme, searchModel, chatModel, visionModel, summaryStyle, chatStyle, userid]);
    return (result.rowCount ?? 0) > 0;
}

export async function deleteUser(userid: number): Promise<boolean> {
    const result = await pool.query("UPDATE users SET deleted = true WHERE user_id = $1", [userid]);
    return (result.rowCount ?? 0) > 0;
}

export async function getUserByID(userid: number): Promise<any> {
    const result = await pool.query("SELECT users.user_id, creation_date, first_name, last_name, birth_date, settings.search_model, settings.chat_model, settings.vision_model FROM users INNER JOIN settings ON settings.user_id = users.user_id WHERE users.user_id = $1 AND deleted = false", [userid]);
    return result.rows[0];
}

export async function getUserDetails(userid: number): Promise<any> {
    const result = await pool.query("SELECT user_id, creation_date, email_address, first_name, last_name, birth_date::text, gender, occupation, location FROM users WHERE user_id = $1 AND deleted = false", [userid]);
    return result.rows[0];
}

export async function getUserSettings(userid: number): Promise<any> {
    const result = await pool.query("SELECT * FROM settings WHERE user_id = $1", [userid]);
    return result.rows[0];
}

export async function getUserByEmailAddress(email: string): Promise<any> {
    const result = await pool.query("SELECT user_id, first_name, last_name, birth_date FROM users WHERE email_address = $1 AND deleted = false", [email]);
    return result.rows[0];
}

export async function getPasswordHash(identifier: string | number): Promise<string> {
    const field = typeof identifier == "number" ? "user_id" : "email_address";
    
    const result = await pool.query(`SELECT password_hash AS password FROM users WHERE ${field} = $1`, [identifier]);
    return result.rows[0]?.password;
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
    const hash = await getPasswordHash(email);

    if (!hash?.length) return false;

    const valid = await verify(password, hash);
    return valid;
}

export async function emailExists(email: string, userid: number=0): Promise<boolean> {
    const filter = userid ? " AND user_id <> $2" : "";
    const params = userid ? [email, userid] : [email];

    const result = await pool.query(`SELECT COUNT(*) AS total FROM users WHERE email_address = $1${filter}`, params);
    return parseInt(result.rows[0].total) > 0;
}

export async function getSearchHistory(userid: number, limit: number): Promise<any[]> {
    const result = await pool.query("SELECT * FROM searches WHERE user_id = $1 ORDER BY search_date DESC LIMIT $2", [userid, limit]);
    return result.rows;
}

export async function insertSearchHistory(userid: number, query: string): Promise<boolean> {
    const result = await pool.query("INSERT INTO searches (user_id, search_date, query) VALUES ($1, NOW(), $2)", [userid, query]);
    return (result.rowCount ?? 0) > 0;
}

export async function insertImageSearchHistory(userid: number): Promise<number> {
    const result = await pool.query("INSERT INTO image_searches (user_id, search_date) VALUES ($1, NOW()) RETURNING image_search_id", [userid]);
    return result.rows[0]?.image_search_id ?? 0;
}

export async function recordConversation(userid: number, messages: any): Promise<number> {
    try {
        const summary = await generate({
            model: "gpt-oss:20b",
            prompt: `Summarise the following text into a sentence without a period at the end and no longer than 5 words: ${messages[0].content}`
        }) ?? "Unknown Chat";

        const result = await pool.query("INSERT INTO conversations (user_id, start_date, summary, messages) VALUES ($1, NOW(), $2, $3) RETURNING conversation_id", [userid, summary, JSON.stringify(messages)]);
        return result.rows[0]?.conversation_id ?? 0;
    } catch (ex: any) {
        console.error(ex);
        return 0;
    }
}

export async function updateConversation(conversationid: number, messages: any): Promise<boolean> {
    try {
        const result = await pool.query("UPDATE conversations SET messages = $1 WHERE conversation_id = $2", [JSON.stringify(messages), conversationid]);
        return (result.rowCount ?? 0) > 0;
    } catch (ex: any) {
        console.error(ex);
        return false;
    }
}

export async function getConversationHistory(userid: number): Promise<any[]> {
    const result = await pool.query("SELECT * FROM conversations WHERE user_id = $1 ORDER BY start_date DESC", [userid]);
    return result.rows;
}