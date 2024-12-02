import { NextResponse } from "next/server";

import { generateText } from "@/data/models";

export async function GET(request: any): Promise<NextResponse> {
    let params = new URLSearchParams((request.url.includes("?") ? request.url.split("?")[1] : "") ?? "");

    if (!params.get("query")?.length) return NextResponse.json({ error: "Invalid prompt." }, { status: 400 });

    try {
        let model = await generateText({
            model: "deepseek-ai/DeepSeek-V2-Lite",
            prompt: params.get("query") ?? "",
            maxLength: 200
        });
    
        return NextResponse.json({ model }, { status: 200 });
    } catch (ex: any) {
        return NextResponse.json({ error: `Unable to generate text: ${ex.message}.` }, { status: 500 });
    }
}