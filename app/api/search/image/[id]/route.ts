import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import mime from "mime";

import { authenticate } from "@/lib/jwt";
import { generateFromImage } from "@/lib/model";

export async function GET(_: Request, { params }: any): Promise<NextResponse> {
    const { id } = await params;
    const searchid = parseInt(id?.trim() ?? "0");

    if (!searchid || isNaN(searchid)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

    const files = await fs.readdir("./uploads/");
    const file = files.find(file => file.startsWith(`${searchid}-`));

    if (!file?.length) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    const content = await fs.readFile(`./uploads/${file}`);

    return new NextResponse(new Uint8Array(content), {
        headers: {
            "Content-Type": mime.getType(`./uploads/${file}`) ?? "application/octet-stream",
            "Content-Disposition": `inline; filename="${file.substring(file.indexOf("-") + 1)}"`
        }
    });
}

export async function POST(request: Request): Promise<NextResponse> {
    const data = await request.formData();
    const file = data.get("file");
    const query = data.get("query")?.toString().trim();
    
    if (!file || !(file instanceof File)) return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    
    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    const currentSessionUser = await authenticate(token ?? "");

    const summary = await generateFromImage({
        model: currentSessionUser?.vision_model ?? "llama3.2-vision",
        image: file,
        prompt: query
    }) ?? "";

    return NextResponse.json({ summary }, { status: 200 });
}