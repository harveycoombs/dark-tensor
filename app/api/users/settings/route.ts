import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getUserSettings } from "@/data/users";
import { authenticate } from "@/data/jwt";

export async function GET(): Promise<NextResponse> {
    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser?.user_id) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    let settings = await getUserSettings(currentSessionUser.user_id);
    return NextResponse.json({ settings }, { status: 200 });
}