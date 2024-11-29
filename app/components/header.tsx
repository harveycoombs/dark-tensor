import Link from "next/link";

import Button from "@/app/components/ui/button";

export default function Header() {
    return (
        <header className="p-3 select-none bg-white sticky top-0 border-b border-b-slate-300 flex justify-between items-center z-30">
            <Link href="/" className="font-bold duration-100 hover:opacity-85 active:opacity-70">Congruence <span className="text-blue-600">AI</span></Link>
            <nav>
                <Link href="/about" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">About</Link>
                <Link href="/privacy" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">Privacy</Link>
                <Link href="/pricing" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">Pricing</Link>
                <Link href="/developers" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">Developers</Link>
                <Link href="/support" className="text-sm font-medium mx-4 duration-100 hover:text-slate-400">Support</Link>
            </nav>
            <div>
                <Button url="/login" classes="inline-block align-middle">Sign In</Button>
                <Button url="/register" classes="inline-block align-middle ml-1.5" transparent={true}>Register</Button>
            </div>
        </header>
    );
}