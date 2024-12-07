import { NextResponse } from "next/server";

import { generateFromContext } from "@/data/model";
import { recordConversation, updateConversation } from "@/data/users";

import { authenticate } from "@/data/jwt";
import { cookies } from "next/headers";

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

        let response = await generateFromContext({
            model: "deepseek-v2:lite",
            messages: messages
        }) ?? "";

        let end = new Date().getTime();

        return NextResponse.json({ text: response, interval: (end - beginning) }, { status: 200 });
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

    return NextResponse.json({ conversationid: conversationid }, { status: 200 });
}