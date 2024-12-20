import { useEffect, useState, useRef } from "react";  

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import Popup from "@/app/components/common/popup";
import Button from "@/app/components/common/button";
import Menu from "@/app/components/common/menu";
import Field from "@/app/components/common/field";

interface Properties {
    onClose: any;
}

export default function SettingsPopup({ onClose }: Properties) {
    let models = [
        { value: "deepseek-v2:lite", label: "DeepSeek-V2-Lite (15.7B)" },
        { value: "llama3.1", label: "Llama 3.1 (8B)" },
        { value: "llama3.2:1b", label: "Llama 3.2 (1B)" },
        { value: "llama3.2:3b", label: "Llama 3.2 (3B)" },
        { value: "qwq", label: "QwQ (32B)" }
    ];

    let visionModels = [
        { value: "llama3.2-vision", label: "Llama 3.2 Vision (11B)" }
    ];

    let themes = [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" }
    ];
    
    let styles = [
        { value: "verbose", label: "Verbose" },
        { value: "concise", label: "Concise" },
        { value: "balanced", label: "Balanced" }
    ];

    let genders = [
        { value: "m", label: "Male" },
        { value: "f", label: "Female" },
        { value: "", label: "Prefer not to say" }
    ];

    let [user, setUser] = useState<any>();
    let [settings, setSettings] = useState<any>();

    let [currentSection, setCurrentSection] = useState<string>();
    let [sectionTitle, setSectionTitle] = useState<string>();
    let [sectionContent, setSectionContent] = useState<React.JSX.Element>();

    let firstNameField = useRef<HTMLInputElement>(null);
    let lastNameField = useRef<HTMLInputElement>(null);
    let locationField = useRef<HTMLInputElement>(null);
    let birthDateField = useRef<HTMLInputElement>(null);
    let genderField = useRef<HTMLSelectElement>(null);
    let occupationField = useRef<HTMLInputElement>(null);
    let emailField = useRef<HTMLInputElement>(null);

    let searchModelField = useRef<HTMLSelectElement>(null);
    let chatModelField = useRef<HTMLSelectElement>(null);
    let visionModelField = useRef<HTMLSelectElement>(null);
    let themeField = useRef<HTMLSelectElement>(null);
    let chatStyleField = useRef<HTMLSelectElement>(null);
    let summaryStyleField = useRef<HTMLSelectElement>(null);

    let [saveButton, setSaveButton] = useState<React.JSX.Element>(<Button onClick={updateUserSettings}>Save Changes</Button>);

    useEffect(() => {
        (async () => {
            let response = await fetch("/api/users");
            let json = await response.json();
            
            setUser(json.details);
            setSettings(json.settings);

            setCurrentSection("general");
        })();
    }, []);

    async function updateUserDetails() {
        if (
            !firstNameField.current ||
            !lastNameField.current ||
            !locationField.current ||
            !birthDateField.current ||
            !genderField.current ||
            !occupationField.current ||
            !emailField.current
        ) return;

        setSaveButton(<Button disabled={true}>Saving</Button>);

        let details = new URLSearchParams({
            firstname: firstNameField.current.value,
            lastname: lastNameField.current.value,
            location: locationField.current.value,
            birthdate: birthDateField.current.value,
            gender: genderField.current.value,
            email: emailField.current.value,
            occupation: occupationField.current.value
        });

        let response = await fetch("/api/users", {
            method: "PATCH",
            body: details
        });

        let json = await response.json();

        if (!response.ok) {
            setSaveButton(<Button color="red">{json.error}</Button>);
            return;
        } else if (!json.success) {
            setSaveButton(<Button color="red">Something went wrong</Button>);
            return;
        }

        setSaveButton(<Button color="green">Saved</Button>);
        setTimeout(() => setSaveButton(<Button onClick={updateUserDetails}>Save Changes</Button>), 1800);
    }

    async function updateUserSettings() {
        if (
            !searchModelField.current ||
            !chatModelField.current ||
            !visionModelField.current ||
            !themeField.current ||
            !chatStyleField.current ||
            !summaryStyleField.current
        ) return;

        setSaveButton(<Button disabled={true}>Saving</Button>);

        let settings = new URLSearchParams({
            searchmodel: searchModelField.current.value,
            chatmodel: chatModelField.current.value,
            visionmodel: visionModelField.current.value,
            theme: themeField.current.value,
            chatstyle: chatStyleField.current.value,
            summarystyle: summaryStyleField.current.value
        });

        let response = await fetch("/api/users/settings", {
            method: "PATCH",
            body: settings
        });

        let json = await response.json();

        if (!response.ok) {
            setSaveButton(<Button color="red">{json.error}</Button>);
            return;
        } else if (!json.success) {
            setSaveButton(<Button color="red">Something went wrong</Button>);
            return;
        }

        setSaveButton(<Button color="green">Saved</Button>);
        setTimeout(() => setSaveButton(<Button onClick={updateUserSettings}>Save Changes</Button>), 1800);
    }

    async function logout() {
        let response = await fetch("/api/users/sessions", { method: "DELETE" });
        if (!response.ok) return;
    
        window.location.reload();
    }

    useEffect(() => {
        if (!currentSection) return;

        switch (currentSection) {
            case "security":
                setSectionTitle("Security & Privacy");
                setSectionContent(<div></div>);
                setSaveButton(<Button>Save Changes</Button>);
                break;
            case "account":
                setSectionTitle("Account Details");
                setSectionContent(<div>
                    <FieldContainer title="First Name"><Field classes="w-full" defaultValue={user.first_name} ref={firstNameField} /></FieldContainer>
                    <FieldContainer title="Last Name"><Field classes="w-full" defaultValue={user.last_name} ref={lastNameField} /></FieldContainer>
                    <FieldContainer title="Location"><Field classes="w-full" defaultValue={user.location} ref={locationField} /></FieldContainer>
                    <FieldContainer title="Date of Birth"><Field type="date" classes="w-full" defaultValue={user.birth_date} ref={birthDateField} /></FieldContainer>
                    <FieldContainer title="Gender"><Menu classes="w-full" choices={genders} defaultValue={user.gender} ref={genderField} /></FieldContainer>
                    <FieldContainer title="Occupation"><Field classes="w-full" defaultValue={user.occupation} ref={occupationField} /></FieldContainer>
                    <FieldContainer title="Email Address"><Field classes="w-full" defaultValue={user.email_address} ref={emailField} /></FieldContainer>
                </div>);
                setSaveButton(<Button onClick={updateUserDetails}>Save Changes</Button>);
                break;
            default:
                setSectionTitle("General Settings");
                setSectionContent(<div>
                    <FieldContainer title="Preferred Model (Search)"><Menu choices={models} classes="w-full" defaultValue={settings.search_model} ref={searchModelField} /></FieldContainer>
                    <FieldContainer title="Preferred Model (Image Search)"><Menu choices={visionModels} classes="w-full" defaultValue={settings.vision_model} ref={visionModelField} /></FieldContainer>
                    <FieldContainer title="Preferred Model (Chat)"><Menu choices={models} classes="w-full" defaultValue={settings.chat_model} ref={chatModelField} /></FieldContainer>
                    <FieldContainer title="Response Style (Search)"><Menu type="select" choices={styles} classes="w-full" defaultValue={settings.summary_style} ref={summaryStyleField} /></FieldContainer>
                    <FieldContainer title="Response Style (Chat)"><Menu choices={styles} classes="w-full" defaultValue={settings.chat_style} ref={chatStyleField} /></FieldContainer>
                    <FieldContainer title="Theme"><Menu choices={themes} classes="w-full" defaultValue={settings.theme} ref={themeField} /></FieldContainer>
                </div>);
                setSaveButton(<Button onClick={updateUserSettings}>Save Changes</Button>);
                break;
        }
    }, [currentSection]);

    return (
        <Popup title="Settings" onClose={onClose}>
            {settings && user ? <div className="w-650 flex gap-3">
                <div className="w-44 py-3 pr-3 border-r border-r-slate-300 shrink-0">
                    <div>
                        <div className="inline-grid align-middle place-items-center bg-sky-100 text-sky-500 text-sm leading-none select-none font-medium w-9 h-9 rounded-full">{(user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0)).toUpperCase()}</div>
                        <div className="inline-block align-middle mx-2">
                            <strong className="text-sm font-bold">{user.first_name} {user.last_name}</strong>
                            <div className="text-xs font-medium text-slate-400/80">Joined {new Date(user.creation_date).toLocaleString(undefined, { year: "numeric", month: "short" })}</div>
                        </div>
                        <div className="mt-2">
                            <SettingsMenuItem title="General" selected={currentSection == "general"} onClick={() => setCurrentSection("general")} />
                            <SettingsMenuItem title="Account" selected={currentSection == "account"} onClick={() => setCurrentSection("account")} />
                            <SettingsMenuItem title="Privacy & Security" selected={currentSection == "security"} onClick={() => setCurrentSection("security")} />
                            <div className= "p-2 rounded-md leading-none text-[0.81rem] text-red-500 font-medium mt-1 cursor-pointer duration-100 hover:bg-red-50 active:bg-red-100/80" onClick={logout}>Log Out</div>
                        </div>
                    </div>
                </div>
                <div className="py-3 w-full h-96 overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <strong className="block text-sm leading-none font-semibold">{sectionTitle}</strong>
                        {saveButton}
                    </div>
                    <div>{sectionContent}</div>
                </div>
            </div> : <div className="w-650 h-96 grid place-items-center text-2xl text-slate-400/60 leading-none"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /></div>}
        </Popup>
    );
}

function SettingsMenuItem({ title, selected, ...rest }: any) {
    return <div className={`p-2 rounded-md leading-none text-[0.81rem] text-slate-400/60 font-medium${selected ? " bg-slate-100/80" : ""} mt-1 cursor-pointer duration-100 hover:bg-slate-50 active:bg-slate-100/80`} {...rest}>{title}</div>;
}

function FieldContainer({ title, children }: any) {
    return (
        <div className="flex items-center gap-3 w-full mt-2.5">
            <div className="text-[0.81rem] text-slate-400/80 w-1/2">{title}</div>
            <div className="w-1/2">{children}</div>
        </div>
    );
}