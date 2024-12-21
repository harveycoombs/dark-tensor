"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import Header from "@/app/components/header";
import Button from "@/app/components/common/button";
import Result from "@/app/components/common/result";

export default function ImageSearch(e: any) {
    let [id, setID] = useState<number>(0);
    let [summary, setSummary] = useState<React.JSX.Element|null>(null);
    let [results, setResults] = useState<any[]>([]);
    let [isLoading, setLoading] = useState<boolean>(true);

    let [image, setImage] = useState<File|null>(null);
    let [b64, setB64] = useState<string>("");

    useEffect(() => {
        (async () => {
            let { id } = await e.params;
            setID(parseInt(id.trim()));
        })();
    }, []);

    useEffect(() => {
        if (!id) return;

        (async () => {
            let response = await fetch(`/api/search/image/${id}`);
            let buffer = await response.arrayBuffer();

            if (!response.ok) {
                // error
                return;
            }

            let filename = response.headers.get("Content-Disposition")?.split("filename=")[1].replace(/"/g, "") ?? "unknown";
            setImage(new File([new Uint8Array(buffer)], filename, { type: response.headers.get("Content-Type") ?? "application/octet-stream" }));

            let reader = new FileReader();

            reader.addEventListener("load", () => setB64(reader.result as string));
            reader.readAsDataURL(new Blob([new Uint8Array(buffer)]));
        })();
    }, [id]);

    useEffect(() => {
        if (!image) return;

        (async () => {
            let formData = new FormData();
            formData.append("file", image);

            let response = await fetch("/api/search/image", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                // error
                return;
            }

            let { summary } = await response.json();
            setSummary(<div className="w-650 mx-auto select-none text-center font-medium text-slate-400/60 max-[700px]:w-full">{summary}</div>);
            setLoading(false);
        })();
    }, [image]);

    return (
        <>
            <Header />
            <main className="min-h-[calc(100vh-110px)] grid place-items-center">
                <section className="py-6 w-full max-[700px]:px-3">
                    <div className="w-650 mx-auto mb-3 max-[700px]:w-full">
                        <Link href="/" className="group text-sm duration-100 font-medium hover:text-slate-500/75"><FontAwesomeIcon icon={faArrowLeft} className="pr-1 duration-100 group-hover:pr-2" />Back to Search</Link>
                    </div>
                    <div className="w-650 mx-auto py-2 pl-3.5 pr-2 mb-6 rounded-xl border border-slate-300 flex items-center duration-100 justify-between gap-2 has-[input:focus]:border-sky-500 has-[input:focus]:shadow-md max-[700px]:w-full">
                        {image && b64.length ? <Image src={b64} alt={image.name} width={26} height={26} className="rounded" /> : null}
                        <input type="text" className="w-full focus:outline-none text-sm placeholder:text-slate-400/60 placeholder:select-none" placeholder="Start typing..." defaultValue={image?.name ?? ""} readOnly={true} />
                        <Button classes="invisible">Search</Button>
                    </div>
                    {isLoading ? <div className="w-650 mx-auto select-none text-center font-medium text-slate-400/60 max-[700px]:w-full"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /><span className="pl-2">Generating Summary</span></div> : summary}
                    <div className="w-650 mx-auto mb-3 mt-6 max-[700px]:w-full">
                        {isLoading ? null : <h1 className="text-lg font-semibold select-none">Results</h1>}
                        {results.map((result: any, index: number) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                                <Result data={result} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}