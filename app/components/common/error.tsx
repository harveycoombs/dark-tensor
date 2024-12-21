import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Properties {
    text?: string;
    icon?: any;
    classes?: string;
}

export default function Error({ text, icon, classes }: Properties) {
    return <div className={`block rounded-md px-3 py-2 bg-red-50 text-sm text-center leading-none text-red-500 font-semibold select-none${classes?.length ? " " + classes : ""}`}><FontAwesomeIcon icon={icon ?? faCircleExclamation} className="mr-0.5" /> {text ?? "Something went wrong"}</div>
}