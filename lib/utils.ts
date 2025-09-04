export function getModelCleanName(name: string) {
    switch (name) {
        case "gpt-oss:20b":
            return "GPT OSS (20B)";
        case "llama3.2-vision":
            return "Llama 3.2";
        default:
            return name;
    }
}

export function parseHTML(html: string): string {
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
               .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
               .replace(/<!--[\s\S]*?-->/g, "");

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const cleanText = (text: string) => {
        return text.replace(/\s+/g, " ")
                  .replace(/\n/g, " ")
                  .trim()
                  .replace(/[^\S\r\n]+/g, " ");
    };

    const getImportance = (element: Element): number => {
        const tag = element.tagName.toLowerCase();
        const isMainContent = element.closest("main, article, .content, .main");
        const hasKeywords = element.className.toLowerCase().match(/content|main|article|text/);
        
        return (isMainContent ? 2 : 0) + 
               (hasKeywords ? 1 : 0) + 
               (["p", "h1", "h2", "h3"].includes(tag) ? 1 : 0);
    };

    const content = {
        url: doc.URL || "",
        title: doc.title ? cleanText(doc.title) : "",
        metadata: {
            description: doc.querySelector("meta[name=\"description\"]")?.getAttribute("content") || "",
            keywords: doc.querySelector("meta[name=\"keywords\"]")?.getAttribute("content") || "",
            author: doc.querySelector("meta[name=\"author\"]")?.getAttribute("content") || ""
        },
        mainContent: {
            headings: Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"))
                .filter(h => getImportance(h) > 0)
                .map(h => ({
                    level: parseInt(h.tagName.charAt(1)),
                    text: cleanText(h.textContent || ""),
                    importance: getImportance(h)
                }))
                .filter(h => h.text.length > 0),
            
            paragraphs: Array.from(doc.querySelectorAll("p"))
                .filter(p => getImportance(p) > 0)
                .map(p => ({
                    text: cleanText(p.textContent || ""),
                    importance: getImportance(p)
                }))
                .filter(p => p.text.length > 20),
            
            lists: Array.from(doc.querySelectorAll("ul, ol"))
                .filter(list => getImportance(list) > 0)
                .map(list => ({
                    type: list.tagName.toLowerCase(),
                    items: Array.from(list.querySelectorAll("li"))
                        .map(li => cleanText(li.textContent || ""))
                        .filter(text => text.length > 0)
                }))
                .filter(list => list.items.length > 0),
            
            tables: Array.from(doc.querySelectorAll("table"))
                .filter(table => getImportance(table) > 0)
                .map(table => ({
                    headers: Array.from(table.querySelectorAll("th"))
                        .map(th => cleanText(th.textContent || ""))
                        .filter(text => text.length > 0),
                    rows: Array.from(table.querySelectorAll("tr"))
                        .map(tr => Array.from(tr.querySelectorAll("td"))
                            .map(td => cleanText(td.textContent || ""))
                            .filter(text => text.length > 0))
                        .filter(row => row.length > 0)
                }))
                .filter(table => table.headers.length > 0 || table.rows.length > 0)
        }
    };

    const cleanObject = (obj: any): any => {
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                if (obj[key].length === 0) {
                    delete obj[key];
                }
            } else if (typeof obj[key] === "object") {
                obj[key] = cleanObject(obj[key]);
                if (Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                }
            } else if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
        }
        return obj;
    };

    return JSON.stringify(cleanObject(content), null, 2);
}