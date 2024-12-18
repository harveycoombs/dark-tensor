export function getModelCleanName(name: string) {
    switch (name) {
        case "deepseek-v2:lite":
            return "DeepSeek V2 Lite";
        case "qwq":
            return "QwQ";
        case "llama3.1":
            return "Llama 3.1";
        case "llama3.2:1b":
        case "llama3.2:3b":
            return "Llama 3.2";
        default:
            return name;
    }
}