"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faSliders, faMagnifyingGlass, faCompass, faCode, faNewspaper, faDollarSign, faCircleNotch, faCamera, faTrashAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import AnimatedText from "@/app/components/common/AnimatedText";
import Button from "@/app/components/common/Button";
import Tile from "@/app/components/common/Tile";

export default function Home() {
    const searchField = useRef<HTMLInputElement>(null);
    const searchButton = useRef<HTMLButtonElement>(null);
    const imageUploader = useRef<HTMLInputElement>(null);

    const [recentSearchesAreVisible, setRecentSearchesVisibility] = useState<boolean>(false);
    const [recentSearchesArea, setRecentSearchesArea] = useState<React.JSX.Element|null>(null);
    const [image, setImage] = useState<File|null>(null);

    useEffect(() => {
        if (!recentSearchesAreVisible) {
            setRecentSearchesArea(null);
            return;
        }

        setRecentSearchesArea(<div className="text-sm font-medium text-gray-400/60"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /> Loading</div>);

        (async () => {
            const response = await fetch("/api/users/searches");

            if (response.status == 401) {
                setRecentSearchesArea(<div className="text-sm font-medium text-gray-400/60">You are not signed in. <Link href="/signin" className="hover:underline">Click here</Link> to sign in and view your recent searches</div>);
            } else if (!response.ok) {
                setRecentSearchesArea(<div className="text-sm font-medium text-red-500">Something went wrong. Please try again later or report this issue if it persists</div>);
                return;
            }

            if (!response.ok) return;

            const json = await response.json();
            
            if (!json.searches.length) {
                setRecentSearchesArea(<div className="text-sm font-medium text-gray-400/60">You have no recent searches</div>);
                return;
            }

            setRecentSearchesArea(<motion.div initial={{ height: 20, opacity: 0, overflow: "hidden" }} animate={{ height: "auto", opacity: 1, overflow: "visible" }} exit={{ height: 0, opacity: 0, overflow: "hidden" }} transition={{ duration: 0.5, ease: "easeInOut" }} className="grid grid-cols-4 gap-4">{json.searches.map((search: any, index: number) => <Tile key={index} icon={faMagnifyingGlass} classes="flex flex-col justify-between" onClick={performRecentSearch}><p>{(search.query.length >= 30) ? `${search.query.substring(0, 27).trim()}...` : search.query}</p><div className="text-xs font-medium text-gray-400/60 mt-1.5">{new Date(search.search_date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}</div></Tile>)}</motion.div>);
        })();
    }, [recentSearchesAreVisible]);

    function performSuggestedSearch(value: string) {
        if (!searchField?.current || !searchButton?.current) return;

        searchField.current.value = value;

        searchButton.current.disabled = false;
        search();
    }

    function performRecentSearch(e: any) {
        if (!searchField?.current || !searchButton?.current) return;

        searchField.current.value = e.target.querySelector("p")?.innerText ?? "";

        searchButton.current.disabled = false;
        search();
    }

    function search() {
        if (!searchField?.current?.value?.length) return;

        const query = searchField.current.value;

        if (image) {
            imageSearch(query);
            return;
        }
        
        window.location.href = `/search/${query}`;
    }

    async function imageSearch(query: string) {
        if (!image) return;

        const data = new FormData();
        data.append("file", image);

        const response = await fetch("/api/search/image", {
            method: "POST",
            body: data
        });
        
        const json = await response.json();

        if (!response.ok) {
            alert(json.error);
            return;
        }

        window.location.href = `/search/image/${json.id}/${query}`;
    }

    function updateButtonAvailability(e: any) {
        if (!searchButton?.current) return;
        searchButton.current.disabled = !e.target.value.length;

        if (e.target.value.length) {
            searchButton.current.addEventListener("click", search);
        } else {
            searchButton.current.removeEventListener("click", search);
        }
    }

    function handleUpload(e: any) {
        if (!e.target.files.length) return;
        setImage(e.target.files[0]);
    }

    function deleteUpload(e: any) {
        e.stopPropagation();
        setImage(null);
    }

    return (
        <main className="min-h-[calc(100vh-150px)] grid place-items-center pb-6">
            <motion.div className="w-160 mx-auto max-[700px]:w-full max-[700px]:px-3" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <AnimatedText className="block mx-auto h-auto w-3/4" />

                <h2 className="text-lg text-gray-400/60 font-normal my-4 text-center">Find &amp; summarise anything on the web with <span className="text-blue-600 font-semibold">AI</span></h2>

                <div className="flex items-center gap-5 mt-12">
                    <div className="p-2.5 pl-4 rounded-full border border-gray-300 flex items-center duration-200 justify-between gap-2 w-full has-[input:focus]:border-blue-500 has-[input:focus]:shadow-md" onKeyUp={(e: any) => (e.key == "Enter") && search()}>
                        <input type="text" className="w-full focus:outline-hidden text-sm placeholder:text-gray-400/60 placeholder:select-none" placeholder="Start typing..." ref={searchField} onInput={updateButtonAvailability} />
                        <Button ref={searchButton} classes="shrink-0" disabled>{image ? "Image " : ""}Search</Button>
                    </div>

                    <div className="relative">
                        <SearchOption icon={faCamera} title="Search with Image" selected={image} classes={image ? "pointer-events-none cursor-default" : ""} onClick={() => imageUploader?.current?.click()} />
                        {image && <div className="absolute bottom-[-4px] right-[-4px] aspect-square p-0.5 text-[10px] leading-none rounded-xs text-white bg-red-500 cursor-pointer duration-200" title="Delete Image" onClick={deleteUpload}><FontAwesomeIcon icon={faTrashAlt} /></div>}
                    </div>

                    <SearchOption icon={faClockRotateLeft} selected={recentSearchesAreVisible} onClick={() => setRecentSearchesVisibility(!recentSearchesAreVisible)} title="Show Recent Searches" />
                    <SearchOption icon={faSliders} title="Show Filters" />
                </div>

                {recentSearchesAreVisible && <div className="mt-12">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-400">Recent Searches</h3>
                        <SearchOption icon={faArrowRight} small={true} title="View All Searches" />
                    </div>

                    {recentSearchesArea}
                </div>}

                <div className="mt-12">
                    <h3 className="font-medium text-gray-400 mb-2">Suggestions</h3>

                    <div className="grid grid-cols-4 gap-4 max-[700px]:grid-cols-2 max-[700px]:gap-2">
                        <Tile icon={faNewspaper} onClick={(e: any) => performSuggestedSearch(e.target.innerText)}>What&apos;s going on in the news today?</Tile>
                        <Tile icon={faCode} onClick={(e: any) => performSuggestedSearch(e.target.innerText)}>How do I generate bcrypt hashes in Python?</Tile>
                        <Tile icon={faCompass} onClick={(e: any) => performSuggestedSearch(e.target.innerText)}>Which restaurant is considered the best near me?</Tile>
                        <Tile icon={faDollarSign} onClick={(e: any) => performSuggestedSearch(e.target.innerText)}>What are the best over-ear headphones?</Tile>
                    </div>
                </div>
            </motion.div>

            <input type="file" ref={imageUploader} className="hidden" accept="image/*" onChange={handleUpload} />
        </main>
    );
}

function SearchOption({ icon, selected, classes, small, ...rest }: any) {
    return <div className={`${small ? "text-lg" : "text-xl"} leading-none ${selected ? "text-gray-400" : "text-gray-400/60"} cursor-pointer duration-200${classes?.length ? " " + classes : ""} hover:text-gray-400/80 active:text-gray-400`} {...rest}><FontAwesomeIcon icon={icon} /></div>;
}