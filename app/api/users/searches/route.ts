import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getSearchHistory } from "@/lib/users";
import { authenticate } from "@/lib/jwt";

export async function GET(): Promise<NextResponse> {
    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    const currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    const searches = await getSearchHistory(currentSessionUser.user_id, 4);

    return NextResponse.json({ searches }, { status: 200 });
}