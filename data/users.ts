"use server";
import pool from "@/data/database";

export async function getUserByID(userid: number): Promise<any> {
	let [result]: any = await pool.query("SELECT userid, creationdate, username, firstname, lastname, biography, location FROM users WHERE userid= ? AND deleted = 0", [userid]);
	return result[0];
}