interface Properties {
    children: React.ReactNode;
    classes?: string;
    error?: boolean;
    warning?: boolean;
    required?: boolean;
}

export default function Label({ children, classes = "", error, warning, required, ...rest }: Properties) {
    const color = error ? "text-red-500" : warning ? "text-amber-500" : "text-gray-400";
    return <label className={`text-[0.78rem] select-none ${color} text-left block mb-0.5${classes}`} {...rest}>{children}{required && <span className="text-blue-500" title="Required">&#42;</span>}</label>;
}