import { NextResponse } from "next/server";

import { emailExists, createUser, getUserByID, deleteUser } from "@/data/users";
import { createJWT } from "@/data/jwt";

export async function POST(request: Request): Promise<NextResponse> {
    let data = await request.formData();

    let email = data.get("email")?.toString();
    let password = data.get("password")?.toString();
    let firstName = data.get("firstname")?.toString();
    let lastName = data.get("lastname")?.toString();
    let birthdate = data.get("birthdate")?.toString();

    if (!email?.length || !password?.length || !firstName?.length || !lastName?.length || !birthdate?.length) {
        return NextResponse.json({ error: "One or more fields were not provided." }, { status: 400 });
    }

    let emailAlreadyExists = await emailExists(email);
    if (emailAlreadyExists) return NextResponse.json({ error: "Provided email address already exists." }, { status: 409 });

    let userid = await createUser(email, password, firstName, lastName, birthdate);

    if (!userid) return NextResponse.json({ error: "Unable to create user." }, { status: 500 });

    let user = await getUserByID(userid);
    let credentials = createJWT(user);

    let response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("token", credentials.token, {
        httpOnly: true,
        secure: true,
        maxAge: 3155760000
    });

    return response;
}

export async function DELETE(request: Request): Promise<NextResponse> {
    let data = await request.formData();
    let userid = parseInt(data.get("userid")?.toString() ?? "0");

    let deleted = await deleteUser(userid);

    let response = NextResponse.json({ success: deleted }, { status: 200 });
    response.cookies.delete("token");

    return response;
}