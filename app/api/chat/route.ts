import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { generateFromContext } from "@/data/model";
import { getConversationHistory, recordConversation, updateConversation } from "@/data/users";

import { authenticate } from "@/data/jwt";

export async function GET(): Promise<NextResponse> {
    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    let history = await getConversationHistory(currentSessionUser.user_id);
    return NextResponse.json({ history }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
    let data = await request.formData();

    let messages = JSON.parse(data.get("messages")?.toString() ?? "[]");

    if (!messages?.length) return NextResponse.json({ error: "Invalid messages." }, { status: 400 });

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    try {
        let beginning = new Date().getTime();

        let text = await generateFromContext({
            model: currentSessionUser.chat_model ?? "deepseek-v2:lite",
            messages: messages,
            style: currentSessionUser.chat_style ?? "balanced"
        }) ?? "";

        let end = new Date().getTime();

        return NextResponse.json({ text, interval: (end - beginning) }, { status: 200 });
    } catch (ex: any) {
        return NextResponse.json({ error: `Unable to generate response: ${ex.message}.` }, { status: 500 });
    }
}

export async function PATCH(request: Request): Promise<NextResponse> {
    let data = await request.formData();

    let messages = JSON.parse(data.get("messages")?.toString() ?? "[]");
    let conversationid = parseInt(data.get("conversationid")?.toString() ?? "0");

    if (!messages?.length) return NextResponse.json({ error: "Invalid messages." }, { status: 400 });

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    if (!conversationid) {
        conversationid = await recordConversation(currentSessionUser.user_id, messages);
    } else {
        await updateConversation(conversationid, messages);
    }

    return NextResponse.json({ conversationid }, { status: 200 });
}