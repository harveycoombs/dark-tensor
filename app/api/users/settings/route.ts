import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { updateSettings } from "@/lib/users";
import { authenticate } from "@/lib/jwt";

export async function PATCH(request: Request): Promise<NextResponse> {
    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    const currentSessionUser = await authenticate(token ?? "");

    if (!currentSessionUser?.user_id) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    const data = await request.formData();

    const success = await updateSettings(
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