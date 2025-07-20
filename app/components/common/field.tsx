interface Properties {
    type?: string;
    classes?: string;
    error?: boolean;
    warning?: boolean;
    [key: string]: any;
}

export default function Field({ type, classes, error, warning, ...rest }: Properties) {
    const color = error ? "border-red-500" : warning ? "border-amber-500" : "border-gray-300";
    return <input type={type ?? "text"} className={`px-3.5 py-2 box-border rounded-md text-[0.8rem] border ${color} bg-transparent font-medium leading-none duration-200 select-none focus:outline-hidden focus:border-sky-500 focus:shadow-md ${classes?.length ? " " + classes : ""}`} {...rest} />;
}