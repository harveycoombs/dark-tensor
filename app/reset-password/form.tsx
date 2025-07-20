"use client";
import { useState } from "react";

import Field from "@/app/components/common/Field";
import Label from "@/app/components/common/Label";
import Button from "@/app/components/common/Button";
import { Error, Warning } from "@/app/components/common/Notices";

export default function PasswordResetForm() {
    const [email, setEmail] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [errorExists, setErrorExistence] = useState<boolean>(false);
    const [warningExists, setWarningExistence] = useState<boolean>(false);
    const [disabled, setDisability] = useState<boolean>(false);

    const [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    async function send(e: any) {
        e.preventDefault();

        setLoading(true);
        setDisability(true);

        const response = await fetch("/api/users/password", {
            method: "POST",
            body: new URLSearchParams({ email })
        });

        setLoading(false);
        setDisability(false);

        const json = await response.json();

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