"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import Header from "@/app/components/header";
import Button from "@/app/components/common/button";

export default function ImageSearch() {
    let [query, setQuery] = useState<string>("");

    useEffect(() => {
        let parameter = new URLSearchParams(window.location.search)?.get("q") ?? "";
        setQuery(parameter);
    }, []);

    return (
        <>

        </>
    );
}