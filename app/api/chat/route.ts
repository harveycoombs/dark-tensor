import { NextResponse } from "next/server";

import { generateFromContext } from "@/data/model";

export async function GET(request: Request): Promise<NextResponse> {
    let url = new URL(request.url);
    let params = url.searchParams;
    let messages = JSON.parse(params.get("messages") ?? "[]");

    if (!messages?.length) {
        return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
    }

    try {
        let response = await generateFromContext({
            model: "deepseek-v2:lite",
            messages: messages
        });

        return NextResponse.json({ text: response ?? "", }, { status: 200 });
    } catch (ex: any) {
        return NextResponse.json({ error: `Unable to generate response: ${ex.message}.` }, { status: 500 });
    }
}