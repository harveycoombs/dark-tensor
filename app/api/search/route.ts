import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { generate } from "@/data/model";
import { insertSearchHistory } from "@/data/users";
import { authenticate } from "@/data/jwt";

export async function GET(request: Request): Promise<NextResponse> {
    let url = new URL(request.url);
    let params = url.searchParams;
    let query = params.get("query");

    if (!query) {
        return NextResponse.json({ error: "Invalid prompt." }, { status: 400 });
    }

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    try {
        let response = await fetch (`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}`);
        let json = await response.json();

        let style = (currentSessionUser.search_style == "balanced") ? "" : currentSessionUser.search_style;
        let resultSummaryLength = (currentSessionUser.search_style == "concise") ? 20 : (currentSessionUser.search_style == "verbose") ? 60 : 40;
        let overallSummaryLength = (currentSessionUser.search_style == "concise") ? 100 : (currentSessionUser.search_style == "verbose") ? 300 : 200;

        let results = await Promise.all(json.items.map(async (result: any) => {
            let summary = await generate({
                model: currentSessionUser?.search_model ?? "deepseek-v2:lite",
                prompt: `Generate a ${style} summary of the following website in ${resultSummaryLength} words or less:
                Title: '${result.title}'
                Link: '${result.link}'
                Snippet: '${result.snippet}'.
                Make sure you do not prefix or suffix the summary with anything. I just want the summary. Do not hallucinate or speak in any other language than English. You must not exceed the length provided, under any circumstance.`
            });
            
            return { title: result.title, url: result.link, icon: `https://www.google.com/s2/favicons?domain=${new URL(result.link).hostname}`, summary };
        }));

        let summary = await generate({
            model: currentSessionUser?.search_model ?? "deepseek-v2:lite",
            prompt: `Using the following JSON search results, and your own knowledge, generate an overall ${style} consensus in ${overallSummaryLength} words or less: ${JSON.stringify(results)}. Do not hallucinate or speak in any other language than English. You must not exceed the length provided, under any circumstance.`
        });

        return NextResponse.json({ summary, results }, { status: 200 });
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

    let success = await insertSearchHistory(currentSessionUser.user_id, query);

    return NextResponse.json({ success }, { status: 200 });
}