import { useEffect, useState, useRef } from "react";  

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import Popup from "@/app/components/common/Popup";
import Button from "@/app/components/common/Button";
import Menu from "@/app/components/common/Menu";
import Field from "@/app/components/common/Field";
import Switch from "@/app/components/common/Switch";

interface Properties {
    onClose: () => void;
}

export default function SettingsPopup({ onClose }: Properties) {
    const models = [
        { value: "deepseek-v2:lite", label: "DeepSeek-V2-Lite (15.7B)" },
        { value: "llama3.1", label: "Llama 3.1 (8B)" },
        { value: "llama3.2:1b", label: "Llama 3.2 (1B)" },
        { value: "llama3.2:3b", label: "Llama 3.2 (3B)" },
        { value: "qwq", label: "QwQ (32B)" },
        { value: "mistral", label: "Mistral (7B)" }
    ];

    const visionModels = [
        { value: "llama3.2-vision", label: "Llama 3.2 Vision (11B)" }
    ];

    const themes = [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" }
    ];
    
    const styles = [
        { value: "verbose", label: "Verbose" },
        { value: "concise", label: "Concise" },
        { value: "balanced", label: "Balanced" }
    ];

    const genders = [
        { value: "m", label: "Male" },
        { value: "f", label: "Female" },
        { value: "", label: "Prefer not to say" }
    ];

    const [user, setUser] = useState<any>();
    const [settings, setSettings] = useState<any>();

    const [currentSection, setCurrentSection] = useState<string>();
    const [sectionTitle, setSectionTitle] = useState<string>();
    const [sectionContent, setSectionContent] = useState<React.JSX.Element>();

    const firstNameField = useRef<HTMLInputElement>(null);
    const lastNameField = useRef<HTMLInputElement>(null);
    const locationField = useRef<HTMLInputElement>(null);
    const birthDateField = useRef<HTMLInputElement>(null);
    const genderField = useRef<HTMLSelectElement>(null);
    const occupationField = useRef<HTMLInputElement>(null);
    const emailField = useRef<HTMLInputElement>(null);

    const searchModelField = useRef<HTMLSelectElement>(null);
    const chatModelField = useRef<HTMLSelectElement>(null);
    const visionModelField = useRef<HTMLSelectElement>(null);
    const themeField = useRef<HTMLSelectElement>(null);
    const chatStyleField = useRef<HTMLSelectElement>(null);
    const summaryStyleField = useRef<HTMLSelectElement>(null);
    const newTabField = useRef<HTMLInputElement>(null);

    const [saveButton, setSaveButton] = useState<React.JSX.Element>(<Button onClick={updateUserSettings}>Save Changes</Button>);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/users");
            const json = await response.json();
            
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

        const details = new URLSearchParams({
            firstname: firstNameField.current.value,
            lastname: lastNameField.current.value,
            location: locationField.current.value,
            birthdate: birthDateField.current.value,
            gender: genderField.current.value,
            email: emailField.current.value,
            occupation: occupationField.current.value
        });

        const response = await fetch("/api/users", {
            method: "PATCH",
            body: details
        });

        const json = await response.json();

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
            !summaryStyleField.current ||
            !newTabField.current
        ) return;

        setSaveButton(<Button disabled={true}>Saving</Button>);

        const settings = new URLSearchParams({
            searchmodel: searchModelField.current.value,
            chatmodel: chatModelField.current.value,
            visionmodel: visionModelField.current.value,
            theme: themeField.current.value,
            chatstyle: chatStyleField.current.value,
            summarystyle: summaryStyleField.current.value,
            newtab: newTabField.current.checked ? "true" : "false"
        });

        const response = await fetch("/api/users/settings", {
            method: "PATCH",
            body: settings
        });

        const json = await response.json();

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
        const response = await fetch("/api/users/sessions", { method: "DELETE" });
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
                    <FieldContainer title="Open Search Results in New Tab"><Switch checked={settings.new_tab} reference={newTabField} /></FieldContainer>
                </div>);
                setSaveButton(<Button onClick={updateUserSettings}>Save Changes</Button>);
                break;
        }
    }, [currentSection]);

    return (
        <Popup title="Settings" onClose={onClose}>
            {settings && user ? <div className="w-340 flex gap-3">
                <div className="w-44 py-3 pr-3 border-r border-r-gray-300 shrink-0">
                    <div>
                        <div className="inline-grid align-middle place-items-center bg-blue-100 text-blue-500 text-sm leading-none select-none font-medium w-9 h-9 rounded-full">{(user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0)).toUpperCase()}</div>
                        <div className="inline-block align-middle mx-2">
                            <strong className="text-sm font-bold">{user.first_name} {user.last_name}</strong>
                            <div className="text-xs font-medium text-gray-400/80">Joined {new Date(user.creation_date).toLocaleString(undefined, { year: "numeric", month: "short" })}</div>
                        </div>
                        <div className="mt-2">
                            <SettingsMenuItem title="General" selected={currentSection == "general"} onClick={() => setCurrentSection("general")} />
                            <SettingsMenuItem title="Account" selected={currentSection == "account"} onClick={() => setCurrentSection("account")} />
                            <SettingsMenuItem title="Privacy & Security" selected={currentSection == "security"} onClick={() => setCurrentSection("security")} />
                            <div className= "p-2 rounded-md leading-none text-[0.81rem] text-red-500 font-medium mt-1 cursor-pointer duration-200 hover:bg-red-50 active:bg-red-100/80" onClick={logout}>Log Out</div>
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
            </div> : <div className="w-340 h-96 grid place-items-center text-2xl text-gray-400/60 leading-none"><FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /></div>}
        </Popup>
    );
}

function SettingsMenuItem({ title, selected, ...rest }: any) {
    return <div className={`p-2 rounded-md leading-none text-[0.81rem] text-gray-400/60 font-medium${selected ? " bg-gray-100/80" : ""} mt-1 cursor-pointer duration-200 hover:bg-gray-50 active:bg-gray-100/80`} {...rest}>{title}</div>;
}

function FieldContainer({ title, children }: any) {
    return (
        <div className="flex items-center gap-3 w-full mt-2.5">
            <div className="text-[0.81rem] text-gray-400/80 w-1/2">{title}</div>
            <div className="w-1/2">{children}</div>
        </div>
    );
}