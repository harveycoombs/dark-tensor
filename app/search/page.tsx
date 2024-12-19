"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import Header from "@/app/components/header";
import Button from "@/app/components/common/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    let [query, setQuery] = useState<string>("");
    let [summary, setSummary] = useState<React.JSX.Element|null>(null);
    let [results, setResults] = useState<any[]>([]);
    let [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let parameter = new URLSearchParams(window.location.search)?.get("q") ?? "";
        setQuery(parameter);
    }, []);

    useEffect(() => {
        if (!query?.length) return;

        setLoading(true);

        (async () => {
            let response = await fetch(`/api/search?query=${query}`);
            let data = await response.json();

            setLoading(false);

            if (!response.ok) {
                setSummary(<div className="w-650 select-none text-center font-medium text-red-500 max-[700px]:w-full max-[700px]:px-3">Something went wrong</div>);
                return;
            }

            let formatted = formatSummary(data.summary);

            setSummary(<motion.div className="w-650 rounded-xl px-4 py-3 bg-sky-50 text-sky-400 mx-auto relative max-[700px]:w-full max-[700px]:px-3" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ overflow: "hidden", transformOrigin: "top center" }}>
                <h2 className="block mb-2 text-sky-500 font-semibold select-none">Summary</h2>
                <p className="text-sm leading-relaxed">{formatted}</p>
            </motion.div>);

            setResults(data.results);
        })();
    }, [query]);

    useEffect(() => {
        if (!query?.length) return;

        (async () => {
            let response = await fetch("/api/search", {
                method: "POST",
                body: new URLSearchParams({ query })
            });

            if (!response.ok) {
                console.error("Failed to insert search history.");
            }
        })();
    }, [query]);

    function formatSummary(text: string): React.JSX.Element[] {
        let formatted = [];
        
        let parts = text.split(/```([^```]+)```/g);
    
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                let lines = parts[i].split("\n").map((line, index) => <span key={`${i}-${index}`}>{line}<br/></span>);
                formatted.push(...lines);
                continue;
            }

            formatted.push(<code key={i} className="block bg-slate-800 text-slate-100 p-2 rounded-md mb-2">{parts[i]}</code>);
        }
    
        return formatted;
    }

    return (
        <>
            <Header />
            <main className="min-h-[calc(100vh-110px)] grid place-items-center">
                <section className="py-6 w-full max-[700px]:px-3">
                    <div className="w-650 mx-auto mb-3 max-[700px]:w-full">
                        <Link href="/" className="group text-sm duration-100 font-medium hover:text-slate-500/75"><FontAwesomeIcon icon={faArrowLeft} className="pr-1 duration-100 group-hover:pr-2" />Back to Search</Link>
                    </div>
                    <div className="w-650 mx-auto py-2 pl-3.5 pr-2 mb-6 rounded-xl border border-slate-300 flex items-center duration-100 justify-between gap-2 has-[input:focus]:border-sky-500 has-[input:focus]:shadow-md max-[700px]:w-full">
                        <input type="text" className="w-full focus:outline-none text-sm placeholder:text-slate-400/60 placeholder:select-none" placeholder="Start typing..." value={query} readOnly={true} />
                        <Button classes="invisible">Search</Button>
                    </div>
                    {isLoading ? <div className="w-650 mx-auto select-none text-center font-medium text-slate-400/60 max-[700px]:w-full"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /><span className="pl-2">Generating Summary</span></div> : summary}
                    <div className="w-650 mx-auto mb-3 mt-6 max-[700px]:w-full">
                        {isLoading ? null : <h1 className="text-lg font-semibold select-none">Results</h1>}
                        {results.map((result: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <SearchResult data={result} />
                            </motion.div>
                        ))}
                    </div>                    
                </section>
            </main>
        </>
    );
}

function SearchResult({ data }: any) {
    return (
        <Link href={data.url} className="block p-3 bg-slate-50 text-slate-500 rounded-xl mt-2.5 duration-100 hover:bg-slate-100">
            <div className="flex items-center gap-2">
                <div className="w-4.5 h-4.5 bg-slate-300/60 rounded inline-grid place-items-center">{data.icon ? <img src={data.icon} alt={data.title} width={14} height={14} /> : <FontAwesomeIcon icon={faGlobe} className="text-xs text-slate-400" />}</div>
                <strong className="block font-semibold">{data.title}</strong>
            </div>
            <div className="block text-sm mt-1 text-slate-400">{data.summary}</div>
        </Link>
    );
}