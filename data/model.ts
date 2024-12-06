import ollama from "ollama";

interface ModelOptions {
    model: string;
    prompt?: string;
    messages?: any[];
}

export async function generate({ model, prompt }: ModelOptions): Promise<any> {
    if (!model?.length || !prompt?.length) return null;

    let response = await ollama.chat({
        model: model,
        messages: [{ role: "user", content: prompt.trim() }]
    });

    return response?.message?.content;
}

export async function generateFromContext({ model, messages }: ModelOptions) {
    if (!model?.length || !messages?.length) return null;

    let response = await ollama.chat({
        model: model,
        messages: messages.map(message => ({ role: message.you ? "user" : "assistant", content: message.content.trim() }))
    });

    return response?.message?.content;
}