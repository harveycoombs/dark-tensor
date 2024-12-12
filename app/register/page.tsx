import Link from "next/link";
import RegistrationForm from "./form";

export default function Register() {
    return (
        <main className="h-[calc(100vh-55px)] grid place-items-center">
            <section className="text-center max-[530px]:w-full max-[530px]:px-3.5">
                <Link href="/" className="text-2xl font-bold select-none hover:opacity-85 active:opacity-70">Congruence <span className="text-blue-600">AI</span></Link>
                <strong className="block text-sm font-medium select-none text-slate-400/60">Create an account</strong>
                <RegistrationForm />
                <Link href="/report" className="block text-[0.825rem] font-medium text-slate-400 mt-3 text-center select-none hover:underline">Report An Issue</Link>
            </section>
        </main>
    );
}