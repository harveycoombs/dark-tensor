import jwt from "jsonwebtoken";

export async function authenticate(token: string): Promise<any> {
	return new Promise((resolve, _) => {
		if (!token) {
			resolve(null);
		}

		jwt.verify(token, process.env.JWT_SECRET ?? "", async (ex: any, user: any) => {
			if (ex || !user) {
				resolve(null);
                return;
			}

			resolve(user);
		});
	});
}

export function createJWT(user: any) {
	const now = new Date();

    return {
		token: jwt.sign(JSON.stringify(user), process.env.JWT_SECRET ?? ""),
		timestamp: now.getTime(),
	};
}