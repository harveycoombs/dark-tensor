import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleExclamation, faCircleInfo, faWarning } from "@fortawesome/free-solid-svg-icons";

interface Properties {
    type?: string;
    children: React.ReactNode;
    classes?: string;
    [key: string]: any;
}

export default function Notice({ type = "error", children, classes = "", ...rest }: Properties) {
    let icon: IconProp, colors: string;

    switch (type) {
        case "error":
            icon = faCircleExclamation;
            colors = "bg-red-50 text-red-500";
            break;
        case "warning":
            icon = faWarning;
            colors = "bg-amber-50 text-amber-500";
            break;
        default:
            icon = faCircleInfo;
            colors = "bg-blue-50 text-blue-500";
            break;
    }

    return (
        <div
            className={`block rounded-md px-4 py-3 text-sm text-center leading-none font-semibold select-none ${colors} ${classes}`}
            {...rest}
        >
            <FontAwesomeIcon icon={icon} className="mr-0.5" />
            {children}
        </div>
    );
}