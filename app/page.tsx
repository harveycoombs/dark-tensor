"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faSliders, faMagnifyingGlass, faCompass, faCode, faNewspaper, faDollarSign, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import Header from "@/app/components/header";
import Button from "@/app/components/ui/button";
import Tile from "@/app/components/ui/tile";

export default function Home() {
    let [recentSearchesAreVisible, setRecentSearchesVisibility] = useState<boolean>(false);
    let [recentSearchesArea, setRecentSearchesArea] = useState<React.JSX.Element|null>(null);

    useEffect(() => {
        if (!recentSearchesAreVisible) {
            setRecentSearchesArea(null);
            return;
        }

        setRecentSearchesArea(<div className="mt-12">
            <h3 className="font-medium text-slate-400 mb-2">Recent Searches</h3>
            <div className="text-sm font-medium text-slate-400/60"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /> Loading</div>
        </div>);

        (async () => {
            let response = await fetch("/api/users/searches");

            if (response.status == 401) {
                setRecentSearchesArea(<div className="mt-12">
                    <h3 className="font-medium text-slate-400 mb-2">Recent Searches</h3>
                    <div className="text-sm font-medium text-slate-400/60">You are not signed in. <Link href="/login" className="hover:underline">Click here</Link> to sign in and view your recent searches</div>
                </div>);
            } else if (!response.ok) return;

            let searches = await response.json();
            
            setRecentSearchesArea(<div className="mt-12">
                <h3 className="font-medium text-slate-400 mb-2">Recent Searches</h3>
                {
                    !searches.length ? <div className="text-sm font-medium text-slate-400/60">You have no recent searches</div>
                    : <div className="grid grid-cols-4 gap-4">{searches.map((search: any, index: any) => <Tile key={index} icon={faMagnifyingGlass}>{search.query}</Tile>)}</div>
                }
            </div>);
        })();
    }, [recentSearchesAreVisible]);

    return (
        <>
            <Header />
            <main className="h-[calc(100vh-110px)] grid place-items-center">
                <motion.div className="w-650 mx-auto" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                    <h1 className="text-6xl font-bold text-center">Congruence</h1>
                    <h2 className="text-lg text-slate-400/60 font-medium my-4 text-center">Find &amp; summarise anything on the web with AI</h2>
                    <div className="flex items-center gap-5 mt-12">
                        <div className="py-2 pl-3.5 pr-2 rounded-xl border border-slate-300 flex items-center duration-100 justify-between gap-2 w-full has-[input:focus]:border-blue-600 has-[input:focus]:shadow-md">
                            <input type="text" className="w-full focus:outline-none text-sm placeholder:text-slate-400/60 placeholder:select-none" placeholder="Start typing..." />
                            <Button>Search</Button>
                        </div>
                        <SearchOption icon={faClockRotateLeft} selected={recentSearchesAreVisible} onClick={() => setRecentSearchesVisibility(!recentSearchesAreVisible)} title="Show Recent Searches" />
                        <SearchOption icon={faSliders} title="Show Filters" />
                    </div>
                    {recentSearchesArea}              
                    <div className="mt-12">
                        <h3 className="font-medium text-slate-400 mb-2">Suggestions</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <Tile icon={faNewspaper}>What&apos;s going on in the news today?</Tile>
                            <Tile icon={faCode}>How do I write an generate bcrypt hashes in Python?</Tile>
                            <Tile icon={faCompass}>Which restaurant is considered the best near me?</Tile>
                            <Tile icon={faDollarSign}>What are the best over-ear headphones?</Tile>
                        </div>
                    </div>
                </motion.div>
            </main>
        </>
    );
}

function SearchOption({ icon, selected, ...rest }: any) {
    return <div className={`text-xl leading-none ${selected ? "text-slate-400" : "text-slate-400/60"} cursor-pointer duration-100 hover:text-slate-400/80 active:text-slate-400`} {...rest}><FontAwesomeIcon icon={icon} /></div>;
}