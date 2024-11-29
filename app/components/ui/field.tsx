interface Properties {
    type?: string;
    classes?: string;
    error?: boolean;
    warning?: boolean;
    [key: string]: any;
}

export default function Field({ type, classes, ...rest }: Properties) {
    let classList = `px-3.5 py-2 box-border rounded-md text-[0.8rem] border border-slate-300 bg-transparent font-medium leading-none duration-100 select-none focus:outline-none focus:border-blue-600 ${classes?.length ? " " + classes : ""}`;
    return <input type={type ?? "text"} className={classList} {...rest} />;
}