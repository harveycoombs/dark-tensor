import Link from "next/link";

interface Properties {
    children: React.ReactNode;
    classes?: string;
    url?: string;
    transparent?: boolean;
    [key: string]: any;
}

export default function Button({ children, classes, url, transparent, ...rest }: Properties) {
    let appearance = transparent ? "bg-transparent text-slate-600 font-semibold hover:bg-slate-100 hover:text-slate-500 active:bg-slate-200/75 active:text-slate-600/75" : "bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-800";
    let classList = `px-3.5 py-2.5 rounded-md text-[0.8rem] text-center cursor-pointer font-medium leading-none duration-100 select-none ${appearance}${classes?.length ? " " + classes : ""}`;

    return (
        url?.length ? <Link href={url} className={classList} draggable={false} {...rest}>{children}</Link> : <button className={classList} draggable={false} {...rest}>{children}</button>
    );
}