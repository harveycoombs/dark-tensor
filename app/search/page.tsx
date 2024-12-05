"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import Header from "@/app/components/header";
import Button from "@/app/components/ui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

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
                setSummary(<div className="w-650 select-none text-center font-medium text-red-500">Something went wrong</div>);
                return;
            }

            let formatted = formatSummary(data.summary);

            setSummary(<motion.div className="w-650 rounded-xl px-4 py-3 bg-slate-50 text-slate-400 mx-auto" initial={{ height: 0, opacity: 0 }} animate={{ height: "70vh", opacity: 1 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ overflow: "hidden", transformOrigin: "top center" }}>
                <h2 className="block mb-2 text-slate-500 font-semibold select-none">Summary</h2>
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
                body: new URLSearchParams({ query: query })
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
            <main className="h-[calc(100vh-110px)] grid place-items-center">
                <section>
                    <div className="w-650 mb-3">
                        <Link href="/" className="group text-sm duration-100 font-medium hover:text-slate-500/75"><FontAwesomeIcon icon={faArrowLeft} className="pr-1 duration-100 group-hover:pr-2" />Back to Search</Link>
                    </div>
                    <div className="w-650 py-2 pl-3.5 pr-2 rounded-xl border border-slate-300 flex items-center duration-100 justify-between gap-2 has-[input:focus]:border-blue-600 has-[input:focus]:shadow-md">
                        <input type="text" className="w-full focus:outline-none text-sm placeholder:text-slate-400/60 placeholder:select-none" placeholder="Start typing..." value={query} readOnly={true} />
                        <Button classes="invisible">Search</Button>
                    </div>
                    <div className="mt-6 mb-3">
                        {isLoading ? null : <h1 className="text-lg font-semibold select-none">Results</h1>}
                    </div>
                    {isLoading ? <div className="w-650 select-none text-center font-medium text-slate-400/60"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /><span className="pl-2">Generating Summary</span></div> : summary}
                </section>
            </main>
        </>
    );
}