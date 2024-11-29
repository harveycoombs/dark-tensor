import Link from "next/link";
import LoginForm from "./form";

export default function Login() {
    return (
        <main>
            <section className="text-center">
                <Link href="/" className="text-2xl font-semibold">Congruence <span className="text-blue-600">AI</span></Link>
                <strong className="block text-sm font-medium  text-slate-400/60">Log in to your account</strong>
                <LoginForm />
            </section>
        </main>
    );
}