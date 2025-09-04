import argon2 from "argon2";

export async function generateHash(raw: string): Promise<string> {
	try {
		const hash = await argon2.hash(raw);
		return hash;
	} catch (ex) {
		throw ex;
	}
}

export async function verify(password: string, hash: string): Promise<boolean> {
	try {
		const result = await argon2.verify(hash, password);
		return result;
	} catch (ex) {
		throw ex;
	}
}