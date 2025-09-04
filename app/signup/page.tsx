import Link from "next/link";
import RegistrationForm from "./form";

import Logo from "@/app/components/common/Logo";

export default function Register() {
    return (
        <main className="min-h-[calc(100vh-55px)] grid place-items-center">
            <section className="text-center max-[530px]:w-full max-[530px]:px-3.5">
                <Link href="/" className="block w-fit mx-auto mb-2 duration-200 hover:opacity-85 active:opacity-70" title="Dark Tensor"><Logo width={157} height={36} /></Link>
                <strong className="block text-sm font-medium select-none text-gray-400/60">Create an account</strong>
                <RegistrationForm />
                <Link href="/report" className="block text-[0.825rem] font-medium text-gray-400 mt-3 text-center select-none hover:underline">Report An Issue</Link>
            </section>
        </main>
    );
}