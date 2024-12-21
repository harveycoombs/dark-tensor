"use client";
import { useState } from "react";

import Field from "@/app/components/common/field";
import Label from "@/app/components/common/label";
import Button from "@/app/components/common/button";
import { Error, Warning } from "@/app/components/common/notices";

export default function RegistrationForm() {
    let [email, setEmail] = useState<string>("");
    let [password, setPassword] = useState<string>("");
    let [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
    let [firstName, setFirstName] = useState<string>("");
    let [lastName, setLastName] = useState<string>("");
    let [birthdate, setBirthdate] = useState<string>("");

    let [errorExists, setErrorExistence] = useState<boolean>(false);
    let [warningExists, setWarningExistence] = useState<boolean>(false);
    let [loading, setLoading] = useState<boolean>(false);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);


    async function register(e: any) {
        e.preventDefault();
    }

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
            case "firstname":
                setFirstName(value);
                break;
            case "lastname":
                setLastName(value);
                break;
            case "birthdate":
                setBirthdate(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "passwordconfirmation":
                setPasswordConfirmation(value);
                break;
        }

        setErrorExistence(false);
        setWarningExistence(false);
        setFeedback(null);
    }

    return (
        <form onSubmit={register}>
            {feedback}
            <div className="mt-6 max-[350px]:w-full">
                <div className="inline-block align-middle w-60 max-[530px]:block max-[530px]:w-full">
                    <Label error={errorExists} warning={warningExists}>First Name</Label>
                    <Field classes="block w-full" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("firstname", e.target.value)} />
                    <Label error={errorExists} warning={warningExists}>Last Name</Label>
                    <Field classes="block w-full" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("lastname", e.target.value)} />
                </div>

                <div className="inline-block align-middle w-60 ml-5 max-[530px]:block max-[530px]:w-full max-[530px]:ml-0 max-[530px]:mt-3">

                </div>
            </div>
            <Button classes="block w-full mt-2.5" disabled={loading || !email.length || !password.length} loading={loading}>Continue</Button>
            <Button classes="block w-full mt-2.5" disabled={loading} transparent={true} url="/register">Register</Button>
        </form>
    );
}