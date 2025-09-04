"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import Header from "@/app/components/Header";
import Button from "@/app/components/common/Button";
import Result from "@/app/components/common/Result";
import { Error } from "@/app/components/common/Notices";

export default function Search(e: any) {
    const [query, setQuery] = useState<string>("");
    const [summary, setSummary] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            const { query } = await e.params;
            setQuery(decodeURI(query).trim());
        })();
    }, []);

    useEffect(() => {
        if (!query?.length) return;

        setLoading(true);
        setError("");

        (async () => {
            const response = await fetch(`/api/search?query=${query}`);
            const json = await response.json();

            setLoading(false);

            if (!response.ok) {
                setError(json.error);
                return;
            }

            setSummary(json.summary);
            setResults(json.results);

            await insertSearchHistory();
        })();
    }, [query]);

    async function insertSearchHistory() {
        const response = await fetch("/api/search", {
            method: "POST",
            body: new URLSearchParams({ query })
        });

        if (!response.ok) {
            console.error("Failed to insert search history.");
        }
    }

    function formatSummary(text: string): React.JSX.Element[] {
        let formatted = [];
        
        const parts = text.split(/```([^```]+)```/g);
    
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                const lines = parts[i].split("\n").map((line, index) => <span key={`${i}-${index}`}>{line}<br/></span>);
                formatted.push(...lines);
                continue;
            }

            formatted.push(<code key={i} className="block bg-gray-800 text-gray-100 p-2 rounded-md mb-2">{parts[i]}</code>);
        }
    
        return formatted;
    }

    return (
        <main className="min-h-[calc(100vh-111px)] grid place-items-center">
            <section className="py-6 w-full max-[700px]:px-3">
                <div className="w-160 mx-auto mb-3 max-[700px]:w-full">
                    <Link href="/" className="group text-sm duration-200 font-medium hover:text-gray-500/75"><FontAwesomeIcon icon={faArrowLeft} className="pr-1 duration-200 group-hover:pr-2" />Back to Search</Link>
                </div>

                <div className="w-160 mx-auto py-2 pl-3.5 pr-2 mb-6 rounded-xl border border-gray-300 flex items-center duration-200 justify-between gap-2 has-[input:focus]:border-blue-500 has-[input:focus]:shadow-md max-[700px]:w-full">
                    <input type="text" className="w-full focus:outline-hidden text-sm placeholder:text-gray-400/60 placeholder:select-none" placeholder="Start typing..." value={query} readOnly={true} />
                    <Button classes="invisible">Search</Button>
                </div>

                {loading && <div className="w-160 mx-auto select-none text-center font-medium text-gray-400/60 max-[700px]:w-full"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /><span className="pl-2">Generating Summary</span></div>}

                {!loading && summary.length > 0 && (
                    <motion.div className="w-340 rounded-xl px-4 py-3 bg-blue-50 text-blue-400 mx-auto relative max-[700px]:w-full max-[700px]:px-3" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ overflow: "hidden", transformOrigin: "top center" }}>
                        <h2 className="block mb-2 text-blue-500 font-semibold select-none">Summary</h2>
                        <p className="text-sm leading-relaxed">{formatSummary(summary)}</p>
                    </motion.div>
                )}

                {!loading && error.length > 0 && <Error classes="w-fit mx-auto" text={error} />}

                <div className="w-160 mx-auto mb-3 mt-6 max-[700px]:w-full">
                    {(loading || results.length) ? null : <h1 className="text-lg font-semibold select-none">Results</h1>}
                    {results.map((result: any, index: number) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                            <Result data={result} />
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}