import Link from "next/link";

export default function Footer() {
    return <footer className="p-4 text-sm text-slate-400/60 font-medium select-none text-center">&copy; {new Date().getFullYear()} Collate AI &#40;Formerly Congruence&#41; &middot; <Link href="https://harveycoombs.com/" target="_blank" className="hover:underline">Harvey Coombs</Link></footer>;
}