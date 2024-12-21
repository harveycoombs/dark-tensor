"use client";
import { useState } from "react";

import Field from "@/app/components/common/field";
import Label from "@/app/components/common/label";
import Button from "@/app/components/common/button";
import { Error, Warning } from "@/app/components/common/notices";

export default function PasswordResetForm() {
    let [email, setEmail] = useState<string>("");

    let [loading, setLoading] = useState<boolean>(false);
    let [errorExists, setErrorExistence] = useState<boolean>(false);
    let [warningExists, setWarningExistence] = useState<boolean>(false);
    let [disabled, setDisability] = useState<boolean>(false);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    async function send(e: any) {
        e.preventDefault();

        setLoading(true);
        setDisability(true);

        let response = await fetch("/api/users/password", {
            method: "POST",
            body: new URLSearchParams({ email })
        });

        setLoading(false);
        setDisability(false);

        let json = await response.json();

        if (!response.ok) {
            setErrorExistence(response.status != 400);
            setWarningExistence(response.status == 400);
            setFeedback((response.status == 400) ? <Warning text={json.error} /> : <Error text={json.error} />);

            return;
        }
    }

    return (
        <form onSubmit={send} className="w-60">
            {feedback}
            <Label error={errorExists} warning={warningExists} classes="mt-6">Email Address</Label>
            <Field classes="block w-full" type="email" error={errorExists} onInput={(e: any) => setEmail(e.target.value)} />
            <Button classes="block w-full mt-2.5" disabled={disabled} loading={loading}>Continue</Button>
        </form>
    );
}