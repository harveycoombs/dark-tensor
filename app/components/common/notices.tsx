import { faCircleExclamation, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Properties {
    text?: string;
    icon?: any;
    classes?: string;
}

export function Error({ text, icon, classes }: Properties) {
    return <div className={`block rounded-md px-4 py-3 bg-red-50 text-sm text-center leading-none text-red-500 font-semibold select-none${classes?.length ? " " + classes : ""}`}><FontAwesomeIcon icon={icon ?? faCircleExclamation} className="mr-0.5" /> {text ?? "Something went wrong"}</div>
}

export function Warning({ text, icon, classes }: Properties) {
    return <div className={`block rounded-md px-4 py-3 bg-amber-50 text-sm text-center leading-none text-amber-500 font-semibold select-none${classes?.length ? " " + classes : ""}`}><FontAwesomeIcon icon={icon ?? faWarning} className="mr-0.5" /> {text ?? "Something went wrong"}</div>
}