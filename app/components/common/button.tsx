import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

interface Properties {
    children: React.ReactNode;
    classes?: string;
    url?: string;
    color?: "red" | "green" | "blue";
    transparent?: boolean;
    loading?: boolean;
    [key: string]: any;
}

export default function Button({ children, classes, url, color, transparent, loading, ...rest }: Properties) {
    let bgColor;

    switch (color) {
        case "red":
            bgColor = "bg-red-500 hover:bg-red-600 active:bg-red-700";
            break;
        case "green":
            bgColor = "bg-green-500 hover:bg-green-600 active:bg-green-700";
            break;
        case "blue":
        default:
            bgColor = "bg-sky-500 hover:bg-sky-600 active:bg-sky-700";
            break;
    }

    const appearance = transparent ? "bg-transparent text-slate-600 font-semibold hover:bg-slate-100 hover:text-slate-500 active:bg-slate-200/75 active:text-slate-600/75" : `text-white ${bgColor}`;
    const classList = `px-3.5 py-2.5 rounded-md text-[0.8rem] text-center cursor-pointer font-medium leading-none duration-100 select-none ${appearance}${classes?.length ? " " + classes : ""}`;

    return (
        url?.length ? <Link href={url} className={classList} draggable={false} {...rest}>{children}</Link> : <button className={classList} draggable={false} {...rest}>{loading ? <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /> : children}</button>
    );
}