import ollama from "ollama";

interface ModelOptions {
    model: string;
    prompt?: string;
    messages?: any[];
    style?: "verbose" | "concise" | "balanced" | null;
}

export async function generate({ model, prompt }: ModelOptions): Promise<any> {
    if (!model?.length || !prompt?.length) return null;

    let response = await ollama.chat({
        model: model,
        messages: [{ role: "user", content: prompt.trim() }]
    });

    return response?.message?.content;
}

export async function generateFromContext({ model, messages, style }: ModelOptions) {
    if (!model?.length || !messages?.length) return null;

    let responseStyle = (style == "balanced") ? "" : `${style}ly`;
    let responseLength = (style == "concise") ? 20 : (style == "verbose") ? 60 : 40;

    let response = await ollama.chat({
        model: model,
        messages: messages.map(message => ({ role: message.you ? "user" : "assistant", content: `Respond ${responseStyle} to the following message: ${message.content.trim()}, in ${responseLength} words or less. Do not hallucinate or speak in any other language than English.` }))
    });

    return response?.message?.content;
}