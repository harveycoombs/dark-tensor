import Link from "next/link";
import RegistrationForm from "./form";

import Logo from "@/app/components/common/Logo";

export default function Register() {
    return (
        <main className="min-h-[calc(100vh-55px)] grid place-items-center">
            <section className="text-center">
                <Link href="/" className="block w-fit text-blue-600 mx-auto mb-3 duration-200 hover:text-blue-500 active:text-blue-400" title="Dark Tensor"><Logo width={157} height={36} /></Link>
                <strong className="block font-medium select-none text-gray-400 mb-8.5">Create an Account</strong>

                <div className="border border-gray-200 p-6.5 rounded-2xl">
                    <RegistrationForm />
                </div>
            </section>
        </main>
    );
}