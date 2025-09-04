"use client";
import { useState } from "react";

import Field from "@/app/components/common/Field";
import Label from "@/app/components/common/Label";
import Button from "@/app/components/common/Button";
import { Error, Warning } from "@/app/components/common/Notices";

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

        const response = await fetch("/api/users/sessions", {
            method: "POST",
            body: new URLSearchParams({ email, password })
        });

        const json = await response.json();

        if (!response.ok || json.error) {
            setErrorExistence(response.status != 400);
            setWarningExistence(response.status == 400);
            setLoading(false);

            setFeedback((response.status == 400) ? <Warning text="Invalid credentials" small={true} classes="mt-6" /> : <Error small={true} classes="mt-6" />);

            return;
        }

        window.location.href = "/";
    }

    function updateField(name: string, value: string) {
        switch (name) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
        }

        setErrorExistence(false);
        setWarningExistence(false);
        setFeedback(null);
    }

    return (
        <form onSubmit={login} className="w-60">
            {feedback}
            <Label error={errorExists} warning={warningExists} classes="mt-6">Email Address</Label>
            <Field classes="block w-full" disabled={loading} type="email" error={errorExists} warning={warningExists} onInput={(e: any) => updateField("email", e.target.value)} />
            <Label error={errorExists} warning={warningExists} classes="mt-2.5">Password</Label>
            <Field classes="block w-full" disabled={loading} type="password" error={errorExists} warning={warningExists} onInput={(e: any) => updateField("password", e.target.value)} />
            <Button classes="block w-full mt-2.5" disabled={loading || !email.length || !password.length} loading={loading}>Continue</Button>
            <Button classes="block w-full mt-2.5" disabled={loading} url="/signup" color="transparent">Register</Button>
        </form>
    );
}