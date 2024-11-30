"use client";
import { useState } from "react";

import Field from "@/app/components/ui/field";
import Label from "@/app/components/ui/label";
import Button from "@/app/components/ui/button";

export default function LoginForm() {
    let [email, setEmail] = useState<string>("");
    let [password, setPassword] = useState<string>("");

    let [errorExists, setErrorExistence] = useState<boolean>(false);
    let [warningExists, setWarningExistence] = useState<boolean>(false);

    let [disabled, setDisability] = useState<boolean>(false);

    let [button, setButton] = useState<React.JSX.Element>(<Button classes="block w-full mt-2.5">Continue</Button>);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    async function login(e: any) {
        e.preventDefault();

        setErrorExistence(false);
        setButton(<Button classes="block w-full mt-2.5 opacity-65 pointer-events-none">&nbsp; Loading &nbsp;</Button>);
        setDisability(true);

        let credentials = new URLSearchParams({ email: email, password: password });

        try {  
            let response = await fetch("/api/users/sessions", {
                method: "POST",
                body: credentials
            });

            let json = await response.json();

            if (!json.success) {
                setErrorExistence(false);
                setWarningExistence(true);
                setDisability(false);

                setButton(<Button classes="block w-full mt-2.5">Continue</Button>);
                setFeedback(<div className="text-sm font-medium text-center text-amber-400">Invalid credentials</div>);

                return;
            }

            window.location.href = "/";
        } catch {
            setWarningExistence(false);
            setErrorExistence(true);
            setButton(<Button classes="block w-full mt-2.5">Continue</Button>);
            setFeedback(<div className="text-sm font-medium text-center text-red-500">Something went wrong</div>);
        }
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
            <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} type="email" error={errorExists} warning={warningExists} onInput={(e: any) => updateField("email", e.target.value)} />

            <Label error={errorExists} warning={warningExists} classes="mt-2.5">Password</Label>
            <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} type="password" error={errorExists} warning={warningExists} onInput={(e: any) => updateField("password", e.target.value)} />
                
            {button}
            <Button classes={`block w-full mt-2.5${disabled ? " pointer-events-none" : ""}`} disabled={disabled} transparent={true} url="/register">Register</Button>
        </form>
    );
}