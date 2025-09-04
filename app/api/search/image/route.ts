import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";

import { authenticate } from "@/lib/jwt";
import { insertImageSearchHistory } from "@/lib/users";

export async function POST(request: Request): Promise<NextResponse> {
    const data = await request.formData();
    const file = data.get("file");

    if (!file || !(file instanceof File)) return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });

    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    const currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    const id = await insertImageSearchHistory(currentSessionUser.user_id);

    if (!id) return NextResponse.json({ error: "Failed to insert image search history." }, { status: 500 });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(`./uploads/${id}-${file.name}`, new Uint8Array(buffer));

    return NextResponse.json({ id }, { status: 200 });
}