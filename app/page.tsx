"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faSliders, faMagnifyingGlass, faCompass, faCode, faNewspaper, faDollarSign } from "@fortawesome/free-solid-svg-icons";

import Header from "@/app/components/header";
import Button from "@/app/components/ui/button";
import Tile from "@/app/components/ui/tile";


export default function Home() {
    let [recentSearches, setRecentSearches] = useState<any[]>([]);
    let [recentSearchesAreLoading, setRecentSearchesAreLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setRecentSearchesAreLoading(true);

            let response = await fetch("/api/users/searches/recent");
            let searches = await response.json();

            setRecentSearches(searches);
            setRecentSearchesAreLoading(false);
        })();
    }, []);

    return (
        <>
            <Header />
            <main className="h-[calc(100vh-110px)] grid place-items-center">
                <section className="w-650 mx-auto">
                    <h1 className="text-6xl font-bold text-center">Congruence</h1>
                    <h2 className="text-lg text-slate-400/60 font-medium my-4 text-center">Find &amp; summarise anything on the web with AI</h2>
                    <div className="flex items-center gap-5 mt-12">
                        <div className="py-2 pl-3.5 pr-2 rounded-xl border border-slate-300 flex items-center duration-100 justify-between gap-2 w-full has-[input:focus]:border-blue-600">
                            <input type="text" className="w-full focus:outline-none text-sm placeholder:text-slate-400/60 placeholder:select-none" placeholder="Start typing..." />
                            <Button>Search</Button>
                        </div>
                        <SearchOption icon={faClockRotateLeft} />
                        <SearchOption icon={faSliders} />
                    </div>
                    <div className="mt-12">
                        <h3 className="font-medium text-slate-400 mb-2">Recent Searches</h3>
                        <div className="grid grid-cols-4 gap-4">{
                            recentSearchesAreLoading ? <span>Loading...</span> : !recentSearches.length ? <span>You have no recent searches</span> : recentSearches.map((search, index) => <Tile key={index} icon={faMagnifyingGlass}>{search.query}</Tile>)
                        }</div>
                    </div>                    
                    <div className="mt-12">
                        <h3 className="font-medium text-slate-400 mb-2">Suggestions</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <Tile icon={faNewspaper}>What&apos;s going on in the news today?</Tile>
                            <Tile icon={faCode}>How do I write an generate bcrypt hashes in Python?</Tile>
                            <Tile icon={faCompass}>Which restaurant is considered the best near me?</Tile>
                            <Tile icon={faDollarSign}>What are the best over-ear headphones?</Tile>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

function SearchOption({ icon }: any) {
    return <div className="text-xl leading-none text-slate-400/60 cursor-pointer duration-100 hover:text-slate-400/80 active:text-slate-400"><FontAwesomeIcon icon={icon} /></div>;
}