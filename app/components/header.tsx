"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faGear } from "@fortawesome/free-solid-svg-icons";

import Logo from "@/app/components/common/Logo";
import Button from "@/app/components/common/Button";

import SettingsPopup from "@/app/components/popups/Settings";
import ChatPopup from "@/app/components/popups/Chat";

export default function Header() {
    const pathname = usePathname();

    if (pathname == "/login" || pathname == "/register") return null;
    
    const [user, setUser] = useState<any>(null);

    const [settingsPopupIsVisible, setSettingsPopupVisibility] = useState<boolean>(false);
    const [chatPopupIsVisible, setChatPopupVisibility] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/users/sessions");

            if (!response.ok) return;

            const data = await response.json();
            setUser(data.user);
        })();
    }, []);

    return (
        <header className="p-4 select-none bg-white sticky top-0 z-30">
            <div className="p-3 border border-gray-200 rounded-full flex justify-between items-center">


                <nav className="flex gap-8 items-center">
                    <Link href="/" className="text-blue-600 duration-200 hover:text-gray-600 active:text-gray-500">
                        <Logo width={32} height={32} />
                    </Link>

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
                        <Button url="/register" classes="inline-block align-middle ml-1.5" colors="bg-tranpsarent text-gray-500 font-medium hover:bg-gray-50 active:bg-gray-100">Register</Button>
                    </>
                }</div>
                    
                {settingsPopupIsVisible && user ? <SettingsPopup onClose={() => setSettingsPopupVisibility(false)} /> : null}
                {chatPopupIsVisible && user ? <ChatPopup model={user.chat_model} onClose={() => setChatPopupVisibility(false)} /> : null}
            </div>
        </header>
    );
}

function HeaderNavigationOption({ text, url }: any) {
    return <Link href={url} className="text-sm text-gray-400/75 font-medium duration-200 hover:text-gray-500 active:text-gray-600">{text}</Link>;
}

function HeaderIconOption({ icon, ...rest }: any) {
    return <div className="inline-block align-middle mr-4 cursor-pointer duration-200 text-gray-400/60 hover:text-gray-400 active:text-gray-500" {...rest}><FontAwesomeIcon icon={icon} /></div>;
}