"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "@/app/context/UserContext";
import Logo from "@/app/components/common/Logo";
import Button from "@/app/components/common/Button";

import SettingsPopup from "@/app/components/popups/Settings";

export default function Header() {
    const pathname = usePathname();

    if (pathname == "/signin" || pathname == "/signup") return null;
    
    const user = useContext(UserContext);

    const [settingsPopupIsVisible, setSettingsPopupVisibility] = useState<boolean>(false);

    return (
        <header className="p-4 select-none bg-white sticky top-0 z-30 w-340 mx-auto">
            <div className="p-3 border border-gray-200 rounded-full flex justify-between items-center">
                <nav className="flex gap-8 items-center">
                    <Link href="/" className="text-blue-600 duration-200 hover:text-gray-600 active:text-gray-500">
                        <Logo width={32} height={32} />
                    </Link>

                    <HeaderLink url="/about">About</HeaderLink>
                    <HeaderLink url="/news">News</HeaderLink>
                    <HeaderLink url="/pricing">Pricing</HeaderLink>
                    <HeaderLink url="/support">Support</HeaderLink>
                </nav>

                <div>{
                    user ? <>
                        <HeaderIconOption icon={faGear} title="Open Settings" onClick={() => setSettingsPopupVisibility(true)} />
                        <div className="inline-grid align-middle place-items-center bg-blue-100 text-blue-500 text-[0.8rem] leading-none select-none font-medium w-8 h-8 rounded-full" title={`${user.first_name} ${user.last_name} (You)`}>{(user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0)).toUpperCase()}</div>
                    </> : <>
                        <Button url="/signin" classes="inline-block align-middle">Sign In</Button>
                        <Button url="/signup" classes="inline-block align-middle ml-1.5" color="transparent">Sign Up</Button>
                    </>
                }</div>
                    
                {settingsPopupIsVisible && user && <SettingsPopup onClose={() => setSettingsPopupVisibility(false)} />}
            </div>
        </header>
    );
}

function HeaderLink({ children, url }: any) {
    return <Link href={url} className="text-sm text-gray-400/60 font-medium duration-200 hover:text-gray-400 active:text-gray-500">{children}</Link>;
}

function HeaderIconOption({ icon, ...rest }: any) {
    return <div className="inline-block align-middle mr-4 cursor-pointer duration-200 text-gray-400/60 hover:text-gray-400 active:text-gray-500" {...rest}><FontAwesomeIcon icon={icon} /></div>;
}
