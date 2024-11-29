import Link from "next/link";
import RegistrationForm from "./form";

export default function Register() {
    return (
        <main className="h-[calc(100vh-55px)] grid place-items-center">
            <section className="text-center">
                <Link href="/" className="text-2xl font-bold">Congruence <span className="text-blue-600">AI</span></Link>
                <strong className="block text-sm font-medium  text-slate-400/60">Create an account</strong>
                <RegistrationForm />
            </section>
        </main>
    );
}