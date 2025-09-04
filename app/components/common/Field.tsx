interface Properties {
    type?: string;
    classes?: string;
    error?: boolean;
    warning?: boolean;
    [key: string]: any;
}

export default function Field({ type, classes, error, warning, ...rest }: Properties) {
    const baseColor = error ? "from-red-400 to-red-500" : warning ? "from-amber-400 to-amber-500" : "from-gray-50 to-gray-100";
    const borderColor = error ? "border-red-300/50" : warning ? "border-amber-300/50" : "border-gray-200/50";
    const focusBorderColor = error ? "focus:border-red-300" : warning ? "focus:border-amber-300" : "focus:border-blue-300";
    const focusShadow = error ? "focus:shadow-[0_8px_16px_rgba(239,68,68,0.2),0_2px_4px_rgba(239,68,68,0.08)]" : warning ? "focus:shadow-[0_8px_16px_rgba(245,158,11,0.2),0_2px_4px_rgba(245,158,11,0.08)]" : "focus:shadow-[0_8px_16px_rgba(59,130,246,0.2),0_2px_4px_rgba(59,130,246,0.08)]";
    
    const classList = `px-4 py-3 box-border rounded-full text-[0.875rem] border ${borderColor} bg-gradient-to-br ${baseColor} font-medium leading-none duration-300 select-none focus:outline-none ${focusBorderColor} ${focusShadow} hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.08)] focus:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.12)] backdrop-blur-sm backdrop-saturate-150 transition-all ease-out ${classes?.length ? " " + classes : ""}`;
    
    return <input type={type ?? "text"} className={classList} {...rest} />;
}
