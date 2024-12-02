"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import Header from "@/app/components/header";
import Button from "@/app/components/ui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    let [query, setQuery] = useState<string>("");
    let [summary, setSummary] = useState<string>("");
    let [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        let parameter = new URLSearchParams(window.location.search)?.get("q") ?? "";
        setQuery(parameter);
    }, []);

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
                        {summary?.length ? <h1 className="text-lg font-semibold select-none">Results</h1> : null}
                    </div>
                    {summary?.length ? <motion.div className="w-650 rounded-xl px-4 py-3 bg-slate-50 text-slate-400 mx-auto" initial={{ height: 0, opacity: 0 }} animate={{ height: "70vh", opacity: 1 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ overflow: "hidden", transformOrigin: "top center" }}>
                        <h2 className="block mb-2 text-slate-500 font-semibold select-none">Summary</h2>
                        <p className="text-sm leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem est animi ea quae. Distinctio quibusdam cupiditate ipsum voluptatibus et, ducimus odit deserunt debitis illum facilis cumque maxime eligendi, repudiandae, molestias deleniti mollitia fugit corporis optio saepe! Officiis quibusdam veritatis, inventore maiores eaque dolores voluptatibus fugit modi delectus illum in nisi laboriosam beatae obcaecati adipisci dolorem, omnis ad. Tempora ipsam voluptas, soluta harum reiciendis delectus magnam animi tenetur fugit suscipit non exercitationem at eius fugiat officia iure distinctio quidem, incidunt facilis saepe provident quasi obcaecati unde aliquam. Molestiae adipisci sed recusandae. Natus culpa at tempore nostrum consequatur deserunt ratione voluptas accusantium dolore itaque quaerat earum quibusdam, laborum, recusandae harum vitae quia explicabo! Ducimus quo, dolorem est porro asperiores magnam voluptatibus aut. Molestiae iure sapiente ipsam, rerum aperiam officiis dignissimos magni voluptatum iusto cumque totam dolores maiores vitae nulla dolorem a eveniet. Libero quia fuga ut expedita nostrum aperiam vero quo corrupti laboriosam incidunt, tempora ratione quos culpa cumque optio deserunt. Non, similique nihil, minus neque ipsa laudantium reprehenderit sit obcaecati magni ipsum nulla labore eum quis itaque. Dignissimos, corrupti iusto alias laborum odit sunt. Praesentium quae dolor, modi officia animi nisi consequatur iste hic sit libero recusandae pariatur dolore incidunt placeat.</p>
                    </motion.div> : <div className="w-650 select-none text-center font-medium text-slate-400/60"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /><span className="pl-2">Generating Summary</span></div>}
                </section>
            </main>
        </>
    );
}