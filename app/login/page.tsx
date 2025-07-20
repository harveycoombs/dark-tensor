import Link from "next/link";
import LoginForm from "./form";

import Logo from "@/app/components/common/Logo";

export default function Login() {
    return (
        <main className="min-h-[calc(100vh-55px)] grid place-items-center">
            <section className="text-center">
                <Link href="/" className="block w-fit mx-auto mb-2 duration-200 hover:opacity-85 active:opacity-70" title="Dark Tensor"><Logo width={157} height={36} /></Link>
                <strong className="block text-sm font-medium select-none text-gray-400/60">Log in to your account</strong>
                <LoginForm />
                <div className="text-[0.825rem] font-medium text-gray-400 mt-3 text-center select-none">
                    <Link href="/reset-password" className="hover:underline">Reset Password</Link><span className="px-1.5">&middot;</span><Link href="mailto:issues@darktensor.harveycoombs.com" className="hover:underline">Report An Issue</Link>
                </div>
            </section>
        </main>
    );
}