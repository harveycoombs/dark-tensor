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
    let [birthDate, setBirthDate] = useState<string>("");

    let [errorExists, setErrorExistence] = useState<boolean>(false);
    let [warningExists, setWarningExistence] = useState<boolean>(false);
    let [loading, setLoading] = useState<boolean>(false);

    let [feedback, setFeedback] = useState<React.JSX.Element|null>(null);


    async function register(e: any) {
        e.preventDefault();

        setErrorExistence(false);
        setWarningExistence(password != passwordConfirmation);
        setLoading(true);
        setFeedback(null);

        if (password != passwordConfirmation) {
            setFeedback(<Warning text="Passwords do not match" small={true} classes="mt-6" />);
            return;
        }

        let response = await fetch("/api/users", {
            method: "POST",
            body: new URLSearchParams({
                firstname: firstName,
                lastname: lastName,
                birthdate: birthDate,
                email: email,
                password: password
            })
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
                setBirthDate(value);
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
                    <Label error={errorExists} warning={warningExists} required={true}>First Name</Label>
                    <Field classes="block w-full" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("firstname", e.target.value)} />
                    <Label classes="mt-2.5" error={errorExists} warning={warningExists} required={true}>Last Name</Label>
                    <Field classes="block w-full" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("lastname", e.target.value)} />
                    <Label classes="mt-2.5" error={errorExists} warning={warningExists}>Date of Birth</Label>
                    <Field classes="block w-full" type="date" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("birthdate", e.target.value)} />
                </div>

                <div className="inline-block align-middle w-60 ml-5 max-[530px]:block max-[530px]:w-full max-[530px]:ml-0 max-[530px]:mt-3">
                    <Label error={errorExists} warning={warningExists} required={true}>Email Address</Label>
                    <Field classes="block w-full" type="email" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("email", e.target.value)} />
                    <Label classes="mt-2.5" error={errorExists} warning={warningExists} required={true}>Password</Label>
                    <Field classes="block w-full" type="password" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("password", e.target.value)} />
                    <Label classes="mt-2.5" error={errorExists} warning={warningExists} required={true}>Confirm Password</Label>
                    <Field classes="block w-full" type="password" disabled={loading} error={errorExists} warning={warningExists} onInput={(e: any) => updateField("passwordconfirmation", e.target.value)} />
                </div>
            </div>
            <Button classes="block w-60 mx-auto mt-6" disabled={loading || !firstName.length || !lastName.length || !email.length || !password.length || !passwordConfirmation.length} loading={loading}>Continue</Button>
            <Button classes="block w-60 mx-auto mt-2.5" disabled={loading} transparent={true} url="/login">I Already Have an Account</Button>
        </form>
    );
}