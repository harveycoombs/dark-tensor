import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as fs from "fs/promises";

import { insertImageSearchHistory } from "@/data/users";
import { authenticate } from "@/data/jwt";

export async function POST(request: Request): Promise<NextResponse> {
    let data = await request.formData();
    let file = data.get("file");

    if (!file || !(file instanceof File)) return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });

    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    let id = await insertImageSearchHistory(currentSessionUser.user_id);

    if (!id) return NextResponse.json({ error: "Failed to insert image search history." }, { status: 500 });

    let buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(`./uploads/${id}-${file.name}`, new Uint8Array(buffer));

    return NextResponse.json({ id }, { status: 200 });
}