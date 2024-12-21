import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { authenticate } from "@/data/jwt";
import { generateFromImage } from "@/data/model";

export async function POST(request: Request): Promise<NextResponse> {
    let data = await request.formData();
    let file = data.get("file");
    
    if (!file || !(file instanceof File)) return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    
    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    let summary = await generateFromImage({
        model: currentSessionUser?.vision_model ?? "llama3.2-vision",
        image: file
    }) ?? "";

    return NextResponse.json({ summary }, { status: 200 });
}