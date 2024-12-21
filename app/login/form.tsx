"use client";
import { useState } from "react";

import Field from "@/app/components/common/field";
import Label from "@/app/components/common/label";
import Button from "@/app/components/common/button";
import { Error, Warning } from "@/app/components/common/notices";

export default function LoginForm() {
    let [email, setEmail] = useState<string>("");
    let [password, setPassword] = useState<string>("");

    let [errorExists, setErrorExistence] = useState<boolean>(false);
    let [warningExists, setWarningExistence] = useState<boolean>(false);
    let [loading, setLoading] = useState<boolean>(false);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    async function login(e: any) {
        e.preventDefault();

        setErrorExistence(false);
        setWarningExistence(false);
        setLoading(true);
        setFeedback(null);

        let response = await fetch("/api/users/sessions", {
            method: "POST",
            body: new URLSearchParams({ email, password })
        });

        let json = await response.json();

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
            <Button classes="block w-full mt-2.5" disabled={loading} transparent={true} url="/register">Register</Button>
        </form>
    );
}