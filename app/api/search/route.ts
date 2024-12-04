import { NextResponse } from "next/server";
import { generateText } from "@/data/model";

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