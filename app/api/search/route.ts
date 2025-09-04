import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { generate } from "@/lib/model";
import { insertSearchHistory } from "@/lib/users";
import { authenticate } from "@/lib/jwt";

export async function GET(request: Request): Promise<NextResponse> {
    const url = new URL(request.url);
    const params = url.searchParams;
    const query = params.get("query");

    if (!query) return NextResponse.json({ error: "Invalid prompt." }, { status: 400 });

    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    const currentSessionUser = await authenticate(token ?? "");

    try {
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}`);
        const json = await response.json();

        const style = (currentSessionUser.search_style == "balanced") ? "" : currentSessionUser.search_style;
        const resultSummaryLength = (currentSessionUser.search_style == "concise") ? 20 : (currentSessionUser.search_style == "verbose") ? 60 : 40;
        const overallSummaryLength = (currentSessionUser.search_style == "concise") ? 100 : (currentSessionUser.search_style == "verbose") ? 300 : 200;

        const results = await Promise.all(json.items.map(async (result: any) => {
            const summary = await generate({
                model: currentSessionUser?.search_model || "gpt-oss:20b",
                prompt: `Generate a ${style} summary of the following website in ${resultSummaryLength} words or less:
                Title: '${result.title}'
                Link: '${result.link}'
                Content: '${result.snippet}'
                Make sure you do not prefix or suffix the summary with anything. I just want the summary. Do not hallucinate or speak in any other language than English. You must not exceed the length provided, under any circumstance.`
            });

            return { title: result.title, url: result.link, icon: `https://www.google.com/s2/favicons?domain=${new URL(result.link).hostname}`, summary };
        }));

        const summary = await generate({
            model: currentSessionUser?.search_model || "gpt-oss:20b",
            prompt: `Using the following JSON search results, and your own knowledge, generate an overall ${style} consensus in ${overallSummaryLength} words or less: ${JSON.stringify(results)}. Do not hallucinate or speak in any other language than English. You must not exceed the length provided, under any circumstance.`
        });

        return NextResponse.json({ summary, results }, { status: 200 });
    } catch (ex: any) {
        return NextResponse.json({ error: `Unable to generate text: ${ex.message}.` }, { status: 500 });
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.formData();
    const query = body.get("query")?.toString();

    if (!query?.length) return NextResponse.json({ error: "Invalid query." }, { status: 400 });

    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    const currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    const success = await insertSearchHistory(currentSessionUser.user_id, query);

    return NextResponse.json({ success }, { status: 200 });
}