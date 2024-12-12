import Link from "next/link";
import LoginForm from "./form";

export default function Login() {
    return (
        <main className="h-[calc(100vh-55px)] grid place-items-center">
            <section className="text-center">
                <Link href="/" className="text-2xl font-bold select-none hover:opacity-85 active:opacity-70">Collate <span className="text-sky-500">AI</span></Link>
                <strong className="block text-sm font-medium select-none text-slate-400/60">Log in to your account</strong>
                <LoginForm />
                <div className="text-[0.825rem] font-medium text-slate-400 mt-3 text-center select-none">
                    <Link href="/reset-password" className="hover:underline">Reset Password</Link><span className="px-1.5">&middot;</span><Link href="mailto:issues@collate.run" className="hover:underline">Report An Issue</Link>
                </div>
            </section>
        </main>
    );
}