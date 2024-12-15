export function getModelCleanName(name: string) {
    switch (name) {
        case "deepseek-v2:lite": 
            return "DeepSeek V2 Lite";
        case "qwq":
            return "QwQ";
        case "llama3.1":
            return "Llama 3.1";
        default:
            return name;
    }
}