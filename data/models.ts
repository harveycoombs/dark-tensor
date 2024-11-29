export async function instantiateModel(name: string, progressCallback: any) {
    if (!name?.length) return null;

    let { pipeline } = await import("@huggingface/transformers");
    return pipeline("text-classification", name, { progress_callback: progressCallback });
}