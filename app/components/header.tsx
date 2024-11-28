import Link from "next/link";

export default function Header() {
    return (
        <header className="p-4 select-none">
            <Link href="/" className="font-bold">Congruence <span className="text-slate-400/60">{process.env.APP_VERSION}</span></Link>
        </header>
    );
}