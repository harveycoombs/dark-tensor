"use server";
import pool from "@/data/database";
import { generateHash, verify } from "@/data/passwords";
import { generate } from "@/data/model";

export async function createUser(email: string, password: string, firstName: string, lastName: string, birthdate: string): Promise<number> {
    const passwordHash = await generateHash(password);
    const [result]: any = await pool.query("INSERT INTO users (creation_date, email_address, password_hash, first_name, last_name, birth_date) VALUES ((SELECT NOW()), ?, ?, ?, ?, ?)", [email, passwordHash, firstName, lastName, birthdate]);
    
    return result.insertId ?? 0;
}

export async function updateUser(userid: number, firstName: string, lastName: string, location: string, birthDate: Date, gender: string, occupation: string, emailAddress: string): Promise<boolean> {
    const [result]: any = await pool.query("UPDATE users SET first_name = ?, last_name = ?, location = ?, birth_date = ?, gender = ?, occupation = ?, email_address = ? WHERE user_id = ?", [firstName, lastName, location, birthDate, gender, occupation, emailAddress, userid]);
    return result.affectedRows > 0;
}

export async function updateSettings(userid: number, theme: string, searchModel: string, chatModel: string, visionModel: string, summaryStyle: string, chatStyle: string): Promise<boolean> {
    const [result]: any = await pool.query("UPDATE settings SET theme = ?, search_model = ?, chat_model = ?, vision_model = ?, summary_style = ?, chat_style = ? WHERE user_id = ?", [theme, searchModel, chatModel, visionModel, summaryStyle, chatStyle, userid]);
    return result.affectedRows > 0;
}

export async function deleteUser(userid: number): Promise<boolean> {
    const [result]: any = await pool.query("UPDATE users SET deleted = 1 WHERE user_id = ?", [userid]);
    return result.affectedRows > 0;
}

export async function getUserByID(userid: number): Promise<any> {
	const [result]: any = await pool.query("SELECT users.user_id, creation_date, first_name, last_name, birth_date, settings.search_model, settings.chat_model, settings.vision_model FROM users INNER JOIN settings ON settings.user_id = users.user_id WHERE users.user_id = ? AND deleted = 0", [userid]);
	return result[0];
}

export async function getUserDetails(userid: number): Promise<any> {
    const [result]: any = await pool.query("SELECT user_id, creation_date, email_address, first_name, last_name, CAST(birth_date AS CHAR) AS birth_date, gender, occupation, location FROM users WHERE user_id = ? AND deleted = 0", [userid]);
    return result[0];
}

export async function getUserSettings(userid: number): Promise<any> {
    const [result]: any = await pool.query("SELECT * FROM settings WHERE user_id = ?", [userid]);
    return result[0];
}

export async function getUserByEmailAddress(email: string): Promise<any> {
    const [result]: any = await pool.query("SELECT user_id, first_name, last_name, birth_date FROM users WHERE email_address = ? AND deleted = 0", [email]);
    return result[0];
}

export async function getPasswordHash(identifier: string | number): Promise<string> {
	const field = typeof identifier == "number" ? "user_id" : "email_address";
    
	const [result]: any = await pool.query(`SELECT password_hash AS \`password\` FROM users WHERE ${field} = ?`, [identifier]);

	return result[0]?.password;
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
	const hash = await getPasswordHash(email);

	if (!hash?.length) return false;

	const valid = await verify(password, hash);
	return valid;
}

export async function emailExists(email: string, userid: number=0): Promise<boolean> {
    const filter = userid ? " AND user_id <> ?" : "";
    const params = userid ? [email, userid] : [email];

	const [result]: any = await pool.query(`SELECT COUNT(*) AS total FROM users WHERE email_address = ?${filter}`, params);
	return result[0].total;
}

export async function getSearchHistory(userid: number, limit: number): Promise<any[]> {
    const [result]: any = await pool.query("SELECT * FROM searches WHERE user_id = ? ORDER BY search_date DESC LIMIT ?", [userid, limit]);
    return result;
}

export async function insertSearchHistory(userid: number, query: string): Promise<boolean> {
    const [result]: any = await pool.query("INSERT INTO searches (user_id, search_date, query) VALUES (?, NOW(), ?)", [userid, query]);
    return result.affectedRows > 0;
}

export async function insertImageSearchHistory(userid: number): Promise<number> {
    const [result]: any = await pool.query("INSERT INTO image_searches (user_id, search_date) VALUES (?, NOW())", [userid]);
    return result.insertId ?? 0;
}

export async function recordConversation(userid: number, messages: any): Promise<number> {
    try {
        const summary = await generate({
            model: "deepseek-v2:lite",
            prompt: `Summarise the following text into a sentence without a period at the end and no longer than 5 words: ${messages[0].content}`
        }) ?? "Unknown Chat";

        const [result]: any = await pool.query("INSERT INTO conversations (user_id, start_date, summary, messages) VALUES (?, NOW(), ?, ?)", [userid, summary, JSON.stringify(messages)]);
        return result.insertId ?? 0;
    } catch (ex: any) {
        console.error(ex);
        return 0;
    }
}

export async function updateConversation(conversationid: number, messages: any): Promise<boolean> {
    try {
        const [result]: any = await pool.query("UPDATE conversations SET messages = ? WHERE conversation_id = ?", [JSON.stringify(messages), conversationid]);
        return result.affectedRows > 0;
    } catch (ex: any) {
        console.error(ex);
        return false;
    }
}

export async function getConversationHistory(userid: number): Promise<any[]> {
    const [result]: any = await pool.query("SELECT * FROM conversations WHERE user_id = ? ORDER BY start_date DESC", [userid]);
    return result;
}