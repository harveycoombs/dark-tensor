import { NextResponse } from "next/server";

import { generateText } from "@/data/model";

export async function GET(request: Request): Promise<NextResponse> {
    let url = new URL(request.url);
    let params = url.searchParams;
    let prompt = params.get("prompt");

    if (!prompt) {
        return NextResponse.json({ error: "Invalid prompt." }, { status: 400 });
    }

    try {
        let response = await generateText({
            model: "deepseek-v2:lite",
            prompt: prompt
        });

        return NextResponse.json({ text: response ?? "", }, { status: 200 });
    } catch (ex: any) {
        return NextResponse.json({ error: `Unable to generate response: ${ex.message}.` }, { status: 500 });
    }
}