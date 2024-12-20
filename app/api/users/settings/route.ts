import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { updateSettings } from "@/data/users";
import { authenticate } from "@/data/jwt";

export async function PATCH(request: Request): Promise<NextResponse> {
    let cookieJar = await cookies();
    let token = cookieJar.get("token")?.value;
    let currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser?.user_id) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    let data = await request.formData();

    let success = await updateSettings(
        currentSessionUser.user_id,
        data.get("theme")?.toString() ?? "",
        data.get("searchmodel")?.toString() ?? "",
        data.get("chatmodel")?.toString() ?? "",
        data.get("visionmodel")?.toString() ?? "",
        data.get("summarystyle")?.toString() ?? "",
        data.get("chatstyle")?.toString() ?? ""
    );

    return NextResponse.json({ success }, { status: 200 });
}