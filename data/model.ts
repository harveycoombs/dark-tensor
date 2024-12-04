import ollama from "ollama";

interface ModelOptions {
    model: string;
    prompt: string;
}

export async function generateText({ model, prompt }: ModelOptions): Promise<any> {
    if (!model?.length || !prompt?.length) return null;

    let response = await ollama.chat({
        model: model,
        messages: [{ role: "user", content: prompt.trim() }]
    })

    return response?.message;
}