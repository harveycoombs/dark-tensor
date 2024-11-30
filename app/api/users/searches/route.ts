import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getSearchHistory } from "@/data/users";
import { authenticate } from "@/data/jwt";

export async function GET(): Promise<NextResponse> {
    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    let searchHistory = await getSearchHistory(currentSessionUser.user_id, 4);

    return NextResponse.json({ searches: searchHistory }, { status: 200 });
}