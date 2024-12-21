import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Properties {
    text?: string;
    icon?: any;
    classes?: string;
}

export default function Error({ text, icon, classes }: Properties) {
    return <div className={`block rounded px-2 py-1.5 bg-red-50 text-sm text-center leading-none text-red-500 font-medium select-none${classes?.length ? " " + classes : ""}`}><FontAwesomeIcon icon={icon} /> {text ?? "Something went wrong"}</div>
}