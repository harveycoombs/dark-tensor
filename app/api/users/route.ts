import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { emailExists, createUser, updateUser, getUserByID, getUserDetails, getUserSettings, deleteUser } from "@/data/users";
import { createJWT, authenticate } from "@/data/jwt";

export async function GET(): Promise<NextResponse> {
    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    const currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser?.user_id) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    const details = await getUserDetails(currentSessionUser.user_id);
    const settings = await getUserSettings(currentSessionUser.user_id);

    return NextResponse.json({ details, settings }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
    const data = await request.formData();

    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    const firstName = data.get("firstname")?.toString();
    const lastName = data.get("lastname")?.toString();
    const birthdate = data.get("birthdate")?.toString();

    if (!email?.length || !password?.length || !firstName?.length || !lastName?.length || !birthdate?.length) {
        return NextResponse.json({ error: "One or more fields were not provided." }, { status: 400 });
    }

    const emailAlreadyExists = await emailExists(email);
    if (emailAlreadyExists) return NextResponse.json({ error: "Provided email address already exists." }, { status: 409 });

    const userid = await createUser(email, password, firstName, lastName, birthdate);

    if (!userid) return NextResponse.json({ error: "Unable to create user." }, { status: 500 });

    const user = await getUserByID(userid);
    const credentials = createJWT(user);

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("token", credentials.token, {
        httpOnly: true,
        secure: true,
        maxAge: 3155760000
    });

    return response;
}

export async function PATCH(request: Request): Promise<NextResponse> {
    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    const currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser?.user_id) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    const data = await request.formData();

    const success = await updateUser(
        currentSessionUser.user_id,
        data.get("firstname")?.toString() ?? "",
        data.get("lastname")?.toString() ?? "",
        data.get("location")?.toString() ?? "",
        new Date(data.get("birthdate")?.toString() ?? ""),
        data.get("gender")?.toString() ?? "",
        data.get("occupation")?.toString() ?? "",
        data.get("email")?.toString() ?? ""
    );

    return NextResponse.json({ success }, { status: 200 });
}

export async function DELETE(request: Request): Promise<NextResponse> {
    const data = await request.formData();
    const userid = parseInt(data.get("userid")?.toString() ?? "0");

    const success = await deleteUser(userid);

    const response = NextResponse.json({ success }, { status: 200 });
    response.cookies.delete("token");

    return response;
}