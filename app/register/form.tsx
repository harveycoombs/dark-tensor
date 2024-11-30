"use client";
import { useEffect, useRef, useState } from "react";

import Field from "@/app/components/ui/field";
import Label from "@/app/components/ui/label";
import Button from "@/app/components/ui/button";

export default function RegistrationForm() {
    let [email, setEmail] = useState<string>("");
    let [password, setPassword] = useState<string>("");
    let [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
    let [firstName, setFirstName] = useState<string>("");
    let [lastName, setLastName] = useState<string>("");
    let [birthdate, setBirthdate] = useState<string>("");

    let [errorExists, setErrorExistence] = useState<boolean>(false);
    let [warningExists, setWarningExistence] = useState<boolean>(false);

    let [disabled, setDisability] = useState<boolean>(false);

    let continueButton = useRef<HTMLButtonElement>(null);
    let [button, setButton] = useState<React.JSX.Element>(<Button classes="block w-60 mt-6 mx-auto" ref={continueButton}>Continue</Button>);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);

    useEffect(() => {
        if (continueButton?.current) {
            continueButton.current.disabled = (!email.length || !password.length || !firstName.length || !lastName.length);
        }
    }, [email, password, passwordConfirmation, firstName, lastName]);

    async function register(e: any) {
        e.preventDefault();

        if (!email.length || !password.length || !firstName.length || !lastName.length) {
            setErrorExistence(false);
            setWarningExistence(true);
            setFeedback(<div className="text-sm font-medium text-center text-amber-400">One or more fields were not provided</div>);

            return;
        }

        if (password != passwordConfirmation) {
            setErrorExistence(false);
            setWarningExistence(true);
            setFeedback(<div className="text-sm font-medium text-center text-amber-400">Passwords do not match</div>);

            return;
        }

        setErrorExistence(false);
        setButton(<Button classes="block w-60 mt-6 mx-auto opacity-65 pointer-events-none">&nbsp; Loading &nbsp;</Button>);
        setDisability(true);

        let credentials = new URLSearchParams({
            firstName: firstName,
            lastName: lastName,
            birthdate: birthdate,
            email: email,
            password: password
        });

        try {  
            let response = await fetch("/api/users", {
                method: "POST",
                body: credentials
            });

            let json = await response.json();

            if (!json.success) {
                setErrorExistence(false);
                setWarningExistence(true);
                setDisability(false);

                setButton(<Button classes="block w-60 mt-6 mx-auto">Continue</Button>);
                setFeedback(<div className="text-sm font-medium text-center text-amber-400">Invalid credentials</div>);

                return;
            }

            window.location.href = "/";
        } catch {
            setWarningExistence(false);
            setErrorExistence(true);
            setFeedback(<div className="text-sm font-medium text-center text-red-500">Something went wrong</div>);
        }
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

            <div className="mt-6">
                <div className="inline-block align-middle w-60">
                    <Label error={errorExists} warning={warningExists}>First Name</Label>
                    <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("firstname", e.target.value)} />

                    <Label error={errorExists} warning={warningExists} classes="mt-2.5">Last Name</Label>
                    <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("lastname", e.target.value)} />

                    <Label error={errorExists} warning={warningExists} classes="mt-2.5">Date of Birth</Label>
                    <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} type="date" />
                </div>

                <div className="inline-block align-middle w-60 ml-5">
                    <Label error={errorExists} warning={warningExists}>Email Address</Label>
                    <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} type="email" error={errorExists} warning={warningExists} onInput={(e: any) => updateField("email", e.target.value)} />

                    <Label error={errorExists} warning={warningExists} classes="mt-2.5">Password</Label>
                    <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} type="password" error={errorExists} warning={warningExists} onInput={(e: any) => updateField("password", e.target.value)} />

                    <Label error={errorExists} warning={warningExists} classes="mt-2.5">Confirm Password</Label>
                    <Field classes={`block w-full${disabled ? " pointer-events-none" : ""}`} disabled={disabled} type="password" error={errorExists} warning={warningExists} onInput={(e: any) => updateField("passwordconfirmation", e.target.value)} />                
                </div>
            </div>

            {button}
            <Button classes={`block w-60 mt-2.5 mx-auto${disabled ? " pointer-events-none" : ""}`} disabled={disabled} transparent={true} url="/login">I Already Have an Account</Button>
        </form>
    );
}