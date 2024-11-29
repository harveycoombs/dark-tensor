interface Properties {
    children: React.ReactNode;
    classes?: string;
    error?: boolean;
    warning?: boolean;
}

export default function Label({ children, classes, ...rest }: Properties) {
    return <label className={`text-[0.78rem] font-medium text-slate-400 text-left block mb-0.5${classes?.length ? " " + classes : ""}`} {...rest}>{children}</label>;
}