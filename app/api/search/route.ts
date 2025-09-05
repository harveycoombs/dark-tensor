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

    /*const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    const user = await authenticate(token ?? "");*/

    try {
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}`);
        const json = await response.json();

        if (!json.items) return NextResponse.json({ error: "No results found." }, { status: 404 });

        const results = await Promise.all(json.items.map(async (result: any) => {
            const summary = await generate({
                model: "gemma3:12b-it-qat",//"gpt-oss:20b",
                prompt: `Generate a concise summary of the following website in 40 words or less:
                Title: '${result.title}'
                Link: '${result.link}'
                Content: '${result.snippet}'
                Make sure you do not prefix or suffix the summary with anything. I just want the summary. Do not hallucinate or speak in any other language than English. You must not exceed the length provided, under any circumstance. Also, you must not think/reason, all you need to do is provide an accurate and appropriate response to the prompt. You must not exceed the length provided, under any circumstance.`
            });

            return { title: result.title, url: result.link, icon: `https://www.google.com/s2/favicons?domain=${new URL(result.link).hostname}`, summary };
        }));

        const summary = await generate({
            model: "gemma3:12b-it-qat",//"gpt-oss:20b",
            prompt: `Generate a concise answer, using the following JSON search results, and your own knowledge, in 100 words or less: ${JSON.stringify(results)}. Make sure you answer the user's question clearly and accurately, prioritising the search results over your own knowledge, but using your own knowledge to supplement the search results.`
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