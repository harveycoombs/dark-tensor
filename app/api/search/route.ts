import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { generateText } from "@/data/model";
import { insertSearchHistory } from "@/data/users";
import { authenticate } from "@/data/jwt";

export async function GET(request: Request): Promise<NextResponse> {
    let url = new URL(request.url);
    let params = url.searchParams;
    let query = params.get("query");

    if (!query) {
        return NextResponse.json({ error: "Invalid prompt." }, { status: 400 });
    }

    try {
        let response = await generateText({
            model: "deepseek-v2:lite",
            prompt: query
        });

        return NextResponse.json({ summary: response ?? "", results: [] }, { status: 200 });
    } catch (ex: any) {
        return NextResponse.json({ error: `Unable to generate text: ${ex.message}.` }, { status: 500 });
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    let body = await request.formData();
    let query = body.get("query")?.toString();

    if (!query?.length) return NextResponse.json({ error: "Invalid query." }, { status: 400 });

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    let inserted = await insertSearchHistory(currentSessionUser.user_id, query);

    return NextResponse.json({ success: inserted }, { status: 200 });
}