"use client";
import { useState, useEffect } from "react";

import Field from "@/app/components/common/Field";
import Label from "@/app/components/common/Label";
import Button from "@/app/components/common/Button";
import Notice from "@/app/components/common/Notice";

export default function LoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [errorExists, setErrorExistence] = useState<boolean>(false);
    const [warningExists, setWarningExistence] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    async function login(e: any) {
        e.preventDefault();

        setErrorExistence(false);
        setWarningExistence(false);
        setLoading(true);
        setFeedback(null);

        const response = await fetch("/api/users/session", {
            method: "POST",
            body: new URLSearchParams({ email, password })
        });

        const json = await response.json();

        if (!response.ok || json.error) {
            setErrorExistence(response.status != 400);
            setWarningExistence(response.status == 400);
            setLoading(false);

            setFeedback((response.status == 400) ? <Notice type="warning" classes="mt-6">Invalid credentials</Notice> : <Notice type="error" classes="mt-6">Invalid credentials</Notice>);

            return;
        }

        window.location.href = "/";
    }

    useEffect(() => {
        setErrorExistence(false);
        setWarningExistence(false);
        setFeedback(null);
    }, [email, password]);

    return (
        <form onSubmit={login} className="block w-75.5">
            {feedback}

            <Label error={errorExists} warning={warningExists}>Email Address</Label>
            <Field classes="block w-full" disabled={loading} type="email" error={errorExists} warning={warningExists} onInput={(e: any) => setEmail(e.target.value)} />
            <Label error={errorExists} warning={warningExists} classes="mt-3.25">Password</Label>
            <Field classes="block w-full" disabled={loading} type="password" error={errorExists} warning={warningExists} onInput={(e: any) => setPassword(e.target.value)} />

            <Button classes="block w-full mt-3.25" disabled={loading || !email.length || !password.length} loading={loading}>Continue</Button>
            <Button classes="block w-full mt-3.25" disabled={loading} url="/signup" color="transparent">Register</Button>
        </form>
    );
}