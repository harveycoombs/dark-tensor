import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import mime from "mime";

import { insertImageSearchHistory } from "@/data/users";
import { authenticate } from "@/data/jwt";

export async function GET(_: Request, { params }: any): Promise<NextResponse> {
    let { id } = await params;
    let searchid = parseInt(id?.trim() ?? "0");

    if (!searchid || isNaN(searchid)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

    let files = await fs.readdir("./uploads/");
    let file = files.find(file => file.startsWith(`${searchid}-`));

    if (!file?.length) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    let content = await fs.readFile(`./uploads/${file}`);

    return new NextResponse(content, {
        headers: {
            "Content-Type": mime.getType(`./uploads/${file}`) ?? "application/octet-stream",
            "Content-Disposition": `inline; filename="${file.substring(file.indexOf("-") + 1)}"`
        }
    });
}

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