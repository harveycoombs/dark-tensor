"use client";
import { useState, useEffect } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import Field from "@/app/components/common/Field";
import Label from "@/app/components/common/Label";
import Button from "@/app/components/common/Button";
import { Error, Warning } from "@/app/components/common/Notices";

export default function RegistrationForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [captchaToken, setCaptchaToken] = useState<string>("");

    const [errorExists, setErrorExistence] = useState<boolean>(false);
    const [warningExists, setWarningExistence] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    async function register(e: any) {
        e.preventDefault();

        setErrorExistence(false);
        setLoading(true);
        setFeedback(null);

        const response = await fetch("/api/users", {
            method: "POST",
            body: new URLSearchParams({ firstName, lastName, email, password, captchaToken })
        });

        const json = await response.json();

        if (!response.ok) {
            setErrorExistence(response.status != 400);
            setWarningExistence(response.status == 400);
            setLoading(false);

            setFeedback((response.status == 400) ? <Warning text={json.error} small={true} classes="mt-6" /> : <Error small={true} classes="mt-6" />);

            return;
        }

        window.location.href = "/";
    }

    useEffect(() => {
        setErrorExistence(false);
        setWarningExistence(false);
        setFeedback(null);
    }, [firstName, lastName, email, password]);

    return (
        <form onSubmit={register} className="block w-75.5">
            {feedback}

            <Label error={errorExists} warning={warningExists} required={true}>First Name</Label>
            <Field classes="block w-full" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => setFirstName(e.target.value)} />
            <Label classes="mt-3.25" error={errorExists} warning={warningExists} required={true}>Last Name</Label>
            <Field classes="block w-full" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => setLastName(e.target.value)} />

            <Label classes="mt-3.25" error={errorExists} warning={warningExists} required={true}>Email Address</Label>
            <Field classes="block w-full" type="email" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => setEmail(e.target.value)} />
            <Label classes="mt-3.25" error={errorExists} warning={warningExists} required={true}>Password</Label>
            <Field classes="block w-full" type="password" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => setPassword(e.target.value)} />

            <div className="my-4 w-fit relative left-1/2 -translate-x-1/2">
                <HCaptcha
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? ""}
                    onVerify={(token, _) => setCaptchaToken(token)}
                />
            </div>

            <Button classes="block w-full" disabled={loading || !firstName.length || !lastName.length || !email.length || !password.length || !captchaToken.length} loading={loading}>Continue</Button>
            <Button classes="block w-full mt-3.25" disabled={loading} url="/signin" color="transparent">I Already Have an Account</Button>
        </form>
    );
}