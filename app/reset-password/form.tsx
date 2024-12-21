"use client";
import { useState } from "react";

import Field from "@/app/components/common/field";
import Label from "@/app/components/common/label";
import Button from "@/app/components/common/button";

export default function PasswordResetForm() {
    let [email, setEmail] = useState<string>("");

    let [errorExists, setErrorExistence] = useState<boolean>(false);    
    let [disabled, setDisability] = useState<boolean>(false);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);
    let [button, setButton] = useState<React.JSX.Element>(<Button classes="block w-full mt-2.5" disabled={disabled} loading={true}>Continue</Button>);

    async function send(e: any) {
        e.preventDefault();
    }

    return (
        <form onSubmit={send} className="w-60">
            {feedback}
            <Label error={errorExists} classes="mt-6">Email Address</Label>
            <Field classes="block w-full" type="email" error={errorExists} onInput={(e: any) => setEmail(e.target.value)} />
            {button}
        </form>
    );
}