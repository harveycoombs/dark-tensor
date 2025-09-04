"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import Header from "@/app/components/Header";
import Button from "@/app/components/common/Button";
import Result from "@/app/components/common/Result";
import Popup from "@/app/components/common/Popup";

export default function ImageSearch(e: any) {
    const [id, setID] = useState<number>(0);
    const [query, setQuery] = useState<string>("");

    const [summary, setSummary] = useState<React.JSX.Element|null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [image, setImage] = useState<File|null>(null);
    const [b64, setB64] = useState<string>("");

    const [imageIsEnlarged, setImageEnlargement] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const { id, query } = await e.params;

            setID(parseInt(id?.trim() ?? "0"));
            setQuery(query?.trim() ?? "");
        })();
    }, []);

    useEffect(() => {
        if (!id) return;

        (async () => {
            const response = await fetch(`/api/search/image/${id}`);
            const buffer = await response.arrayBuffer();

            if (!response.ok) return;

            const filename = response.headers.get("Content-Disposition")?.split("filename=")[1].replace(/"/g, "") ?? "unknown";
            setImage(new File([new Uint8Array(buffer)], filename, { type: response.headers.get("Content-Type") ?? "application/octet-stream" }));

            const reader = new FileReader();

            reader.addEventListener("load", () => setB64(reader.result as string));
            reader.readAsDataURL(new Blob([new Uint8Array(buffer)]));
        })();
    }, [id]);

    useEffect(() => {
        if (!image) return;

        (async () => {
            const formData = new FormData();

            formData.append("file", image);
            formData.append("query", query);

            const response = await fetch(`/api/search/image/${id}`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) return;

            const data = await response.json();
            setSummary(<motion.div className="w-340 rounded-xl px-4 py-3 bg-blue-50 text-blue-400 mx-auto relative max-[700px]:w-full max-[700px]:px-3" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ overflow: "hidden", transformOrigin: "top center" }}>
                <h2 className="block mb-2 text-blue-500 font-semibold select-none">Summary</h2>
                <p className="text-sm leading-relaxed">{data.summary}</p>
            </motion.div>);
            setLoading(false);
        })();
    }, [image]);

    return (
        <main className="min-h-[calc(100vh-111px)] grid place-items-center">
            <section className="py-6 w-full max-[700px]:px-3">
                <div className="w-340 mx-auto mb-3 max-[700px]:w-full">
                    <Link href="/" className="group text-sm duration-200 font-medium hover:text-gray-500/75"><FontAwesomeIcon icon={faArrowLeft} className="pr-1 duration-200 group-hover:pr-2" />Back to Search</Link>
                </div>
                <div className="w-340 mx-auto py-2 pl-3.5 pr-2 mb-6 rounded-xl border border-gray-300 flex items-center duration-200 justify-between gap-2 has-[input:focus]:border-blue-500 has-[input:focus]:shadow-md max-[700px]:w-full">
                    {image && b64.length ? <Image src={b64} alt={image.name} width={26} height={26} className="rounded-sm aspect-square object-cover cursor-pointer duration-200 hover:opacity-80 active:opacity-70" onClick={() => setImageEnlargement(true)} /> : null}
                    <input type="text" className="w-full focus:outline-hidden text-sm placeholder:text-gray-400/60 placeholder:select-none" placeholder="Start typing..." defaultValue={decodeURI(query)} readOnly={true} />
                    <Button classes="invisible">Search</Button>
                </div>
                {loading ? <div className="w-340 mx-auto select-none text-center font-medium text-gray-400/60 max-[700px]:w-full"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /><span className="pl-2">Generating Summary</span></div> : summary}
                <div className="w-340 mx-auto mb-3 mt-6 max-[700px]:w-full">
                    {loading ? null : <h1 className="text-lg font-semibold select-none">Results</h1>}
                    {results.map((result: any, index: number) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                            <Result data={result} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {imageIsEnlarged && image && b64 ? <Popup title={image.name} onClose={() => setImageEnlargement(false)}>
                <div className="py-3">
                    <img src={b64} alt={image.name} className="block rounded-sm w-auto max-h-3/4-screen" draggable={false} />
                </div>
            </Popup> : null}
        </main>
    );
}