"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

import Header from "@/app/components/header";
import Button from "@/app/components/ui/button";

export default function Home() {
    let query = new URLSearchParams(window.location.search)?.get("q") ?? "";

    return (
        <>
            <Header />
            <main className="h-[calc(100vh-110px)] grid place-items-center">
                <section>
                    <div className="py-2 pl-3.5 pr-2 rounded-xl border border-slate-300 flex items-center duration-100 justify-between gap-2 w-full has-[input:focus]:border-blue-600 has-[input:focus]:shadow-md">
                        <input type="text" className="w-full focus:outline-none text-sm placeholder:text-slate-400/60 placeholder:select-none" placeholder="Start typing..." value={query} readOnly={true} />
                        <Button classes="invisible">Search</Button>
                    </div>
                    <div className="mt-6 mb-3">
                        <h1 className="text-lg font-semibold select-none">Results</h1>
                    </div>
                    <motion.div className="w-650 rounded-xl px-4 py-3 bg-slate-50 text-slate-400 mx-auto" initial={{ height: 0, opacity: 0 }} animate={{ height: "70vh", opacity: 1 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ overflow: "hidden", transformOrigin: "top center" }}>
                        <h2 className="block mb-2 text-slate-500 font-semibold select-none">Consensus</h2>
                        <p className="text-sm leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem est animi ea quae. Distinctio quibusdam cupiditate ipsum voluptatibus et, ducimus odit deserunt debitis illum facilis cumque maxime eligendi, repudiandae, molestias deleniti mollitia fugit corporis optio saepe! Officiis quibusdam veritatis, inventore maiores eaque dolores voluptatibus fugit modi delectus illum in nisi laboriosam beatae obcaecati adipisci dolorem, omnis ad. Tempora ipsam voluptas, soluta harum reiciendis delectus magnam animi tenetur fugit suscipit non exercitationem at eius fugiat officia iure distinctio quidem, incidunt facilis saepe provident quasi obcaecati unde aliquam. Molestiae adipisci sed recusandae. Natus culpa at tempore nostrum consequatur deserunt ratione voluptas accusantium dolore itaque quaerat earum quibusdam, laborum, recusandae harum vitae quia explicabo! Ducimus quo, dolorem est porro asperiores magnam voluptatibus aut. Molestiae iure sapiente ipsam, rerum aperiam officiis dignissimos magni voluptatum iusto cumque totam dolores maiores vitae nulla dolorem a eveniet. Libero quia fuga ut expedita nostrum aperiam vero quo corrupti laboriosam incidunt, tempora ratione quos culpa cumque optio deserunt. Non, similique nihil, minus neque ipsa laudantium reprehenderit sit obcaecati magni ipsum nulla labore eum quis itaque. Dignissimos, corrupti iusto alias laborum odit sunt. Praesentium quae dolor, modi officia animi nisi consequatur iste hic sit libero recusandae pariatur dolore incidunt placeat.</p>
                    </motion.div>
                </section>
            </main>
        </>
    );
}