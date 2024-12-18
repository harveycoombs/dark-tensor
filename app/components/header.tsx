"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faGear } from "@fortawesome/free-solid-svg-icons";

import Icon from "@/app/components/common/icon";
import Button from "@/app/components/common/button";

import SettingsPopup from "@/app/components/popups/settings";
import ChatPopup from "@/app/components/popups/chat";

export default function Header() {
    let [user, setUser] = useState<any>(null);

    let [settingsPopupIsVisible, setSettingsPopupVisibility] = useState<boolean>(false);
    let [chatPopupIsVisible, setChatPopupVisibility] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            let response = await fetch("/api/users/sessions");

            if (!response.ok) return;

            let data = await response.json();
            setUser(data.user);
        })();
    }, []);

    return (
        <header className="p-3 select-none bg-white sticky top-0 border-b border-b-slate-300 flex justify-between items-center z-30">
            <Link href="/" className="duration-100 hover:opacity-85 active:opacity-70">
                <Icon width={16} height={24} />
            </Link>
            <nav className="text-sm leading-none font-medium ml-[55px] max-[700px]:hidden">
                <HeaderNavigationOption text="About" url="/about" />
                <HeaderNavigationOption text="Privacy" url="/privacy" />
                <HeaderNavigationOption text="Pricing" url="/pricing" />
                <HeaderNavigationOption text="Support" url="/support" />
            </nav>
            <div>{
                user ? <>
                    <HeaderIconOption icon={faMessage} title="Open Chat" onClick={() => setChatPopupVisibility(true)} />
                    <HeaderIconOption icon={faGear} title="Open Settings" onClick={() => setSettingsPopupVisibility(true)} />
                    <div className="inline-grid align-middle place-items-center bg-sky-100 text-sky-500 text-[0.8rem] leading-none select-none font-medium w-8 h-8 rounded-full" title={`${user.first_name} ${user.last_name} (You)`}>{(user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0)).toUpperCase()}</div>
                </> : <>
                    <Button url="/login" classes="inline-block align-middle">Sign In</Button>
                    <Button url="/register" classes="inline-block align-middle ml-1.5" transparent={true}>Register</Button>
                </>
            }</div>
                
            {settingsPopupIsVisible && user ? <SettingsPopup onClose={() => setSettingsPopupVisibility(false)} /> : null}
            {chatPopupIsVisible && user ? <ChatPopup model={user.chat_model} onClose={() => setChatPopupVisibility(false)} /> : null}
        </header>
    );
}

function HeaderNavigationOption({ text, url }: any) {
    return <Link href={url} className="mx-4 duration-100 hover:text-slate-500/85 active:text-slate-400">{text}</Link>;
}

function HeaderIconOption({ icon, ...rest }: any) {
    return <div className="inline-block align-middle mr-4 cursor-pointer duration-100 text-slate-400/60 hover:text-slate-400 active:text-slate-500" {...rest}><FontAwesomeIcon icon={icon} /></div>;
}