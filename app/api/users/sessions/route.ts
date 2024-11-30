import { NextResponse } from "next/server";

import { getUserByEmailAddress, verifyCredentials } from "@/data/users";
import { createJWT } from "@/data/jwt";

export async function POST(request: Request): Promise<NextResponse> {
    let data = await request.formData();

    let email = data.get("email")?.toString();
    let password = data.get("password")?.toString();

    if (!email?.length) return NextResponse.json({ error: "Email address was not provided." }, { status: 400 });
    if (!password?.length) return NextResponse.json({ error: "Password was not provided." }, { status: 400 });

    let valid = await verifyCredentials(email, password);
    if (!valid) return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });

    let user = await getUserByEmailAddress(email);
    if (!user) return NextResponse.json({ success: false }, { status: 500 });

    let credentials = createJWT(user);

    let response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("token", credentials.token, {
        httpOnly: true,
        secure: true,
        maxAge: 3155760000
    });

    return response;
}

export async function DELETE(): Promise<NextResponse> {
    let response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.delete("token");

    return response;
}