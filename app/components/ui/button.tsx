import Link from "next/link";

interface Properties {
    children: React.ReactNode;
    classes?: string;
    url?: string;
    alt?: boolean;
    [key: string]: any;
}

export default function Button({ children, classes, url, alt, ...rest }: Properties) {
    let appearance = alt ? "" : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800";
    let classList = `px-3.5 py-2.5 rounded-md text-[0.8rem] text-center font-medium leading-none duration-100 select-none ${appearance} ${classes?.length ? " " + classes : ""}`;

    return (
        url?.length ? <Link href={url} className={classList} draggable={false} {...rest}>{children}</Link> : <button className={classList} draggable={false} {...rest}>{children}</button>
    );
}