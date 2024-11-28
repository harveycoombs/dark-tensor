import Link from "next/link";

import Button from "@/app/components/ui/button";

export default function Header() {
    return (
        <header className="p-3 select-none bg-white sticky top-0 border-b border-b-slate-300 flex justify-between items-center z-30">
            <Link href="/" className="font-bold duration-100 hover:opacity-70 active:opacity-90">Congruence <span className="text-slate-400/60">{process.env.APP_VERSION}</span></Link>
            <nav>
                <Link href="/about" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">About</Link>
                <Link href="/privacy" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">Privacy</Link>
                <Link href="/pricing" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">Pricing</Link>
                <Link href="/developers" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">Developers</Link>
                <Link href="/support" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">Support</Link>
            </nav>
            <div>
                <Button>Sign In</Button>
                <Button transparent={true} classes="ml-1.5">Register</Button>
            </div>
        </header>
    );
}