import { faCircleExclamation, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Properties {
    text?: string;
    icon?: any;
    small?: boolean;
    classes?: string;
}

export function Error({ text, icon, small, classes }: Properties) {
    return <div className={`block rounded-md bg-red-50 ${small ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} text-center leading-none text-red-500 font-semibold select-none${classes?.length ? " " + classes : ""}`}><FontAwesomeIcon icon={icon ?? faCircleExclamation} className="mr-0.5" /> {text ?? "Something went wrong"}</div>
}

export function Warning({ text, icon, small, classes }: Properties) {
    return <div className={`block rounded-md bg-amber-50 ${small ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} text-center leading-none text-amber-500 font-semibold select-none${classes?.length ? " " + classes : ""}`}><FontAwesomeIcon icon={icon ?? faWarning} className="mr-0.5" /> {text ?? "Something went wrong"}</div>
}