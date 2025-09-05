"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

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
        <header className="py-4 select-none bg-white sticky top-0 z-30">
            <div className="w-330 mx-auto p-3 border border-gray-200 rounded-full flex justify-between items-center">
                <nav className="flex gap-8 items-center">
                    <Link href="/" className="text-blue-600 duration-200 hover:text-blue-500 active:text-blue-400">
                        <Logo width={32} height={32} />
                    </Link>

                    <HeaderLink url="/about" selected={pathname == "/about"}>About</HeaderLink>
                    <HeaderLink url="/news" selected={pathname == "/news"}>News</HeaderLink>
                    <HeaderLink url="/pricing" selected={pathname == "/pricing"}>Pricing</HeaderLink>
                    <HeaderLink url="/support" selected={pathname == "/support"}>Support</HeaderLink>
                </nav>

                <div className="flex items-center gap-2.5">
                    {user ? <HeaderIconOption icon={faEllipsis} title="Open Settings" onClick={() => setSettingsPopupVisibility(true)} /> : <Button url="/signin" classes="inline-block">Sign In</Button>}

                    {user ? (
                        <div 
                            className="grid align-middle place-items-center bg-blue-100 text-blue-500 text-sm leading-none select-none w-8 h-8 rounded-full" 
                            title={`${user.first_name} ${user.last_name} (You)`}
                        >
                            {(user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0)).toUpperCase()}
                        </div>
                    ) : <Button url="/signup" classes="inline-block" color="transparent">Sign Up</Button>}
                </div>
                    
                {settingsPopupIsVisible && user && <SettingsPopup onClose={() => setSettingsPopupVisibility(false)} />}
            </div>
        </header>
    );
}

function HeaderLink({ children, url, selected = false }: any) {
    return <Link href={url} className={`text-sm font-medium duration-200 ${selected ? "text-gray-400" : "text-gray-400/60 hover:text-gray-400"} active:text-gray-500`}>{children}</Link>;
}

function HeaderIconOption({ icon, ...rest }: any) {
    return <div className="text-lg cursor-pointer duration-200 text-gray-400/60 hover:text-gray-400 active:text-gray-500" {...rest}><FontAwesomeIcon icon={icon} /></div>;
}