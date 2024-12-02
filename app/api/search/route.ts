import { NextResponse } from "next/server";
import { generateText } from "@/data/models";

export async function GET(request: Request): Promise<NextResponse> {
    let url = new URL(request.url);
    let params = url.searchParams;
    let query = params.get("query");

    if (!query) {
        return NextResponse.json({ error: "Invalid prompt." }, { status: 400 });
    }

    try {
        let model = await generateText({
            model: "deepseek-ai/DeepSeek-V2-Lite",
            prompt: query,
            maxLength: 200
        });

        console.log("model", model);

        return NextResponse.json({ summary: "", results: [] }, { status: 200 });
    } catch (ex: any) {
        return NextResponse.json({ error: `Unable to generate text: ${ex.message}.` }, { status: 500 });
    }
}