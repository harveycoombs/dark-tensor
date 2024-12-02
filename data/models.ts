interface ModelOptions {
    model: string;
    prompt: string;
    maxLength: number;
}

export async function generateText({ model, prompt, maxLength }: ModelOptions): Promise<any> {
    if (!model?.length || !prompt?.length) return null;

    let transformers = await import(/* webpackIgnore: true */ "@huggingface/transformers");
    
    if (!transformers?.pipeline) {
        throw new Error("Pipeline unavailable.");
    }

    let generator = await transformers.pipeline("text-generation", model, { device: "gpu" });
    let result = await generator(prompt, { max_length: maxLength });

    return result;
}