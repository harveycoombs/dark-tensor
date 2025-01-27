import { useState } from "react";

interface Properties {
    checked?: boolean;
}

export default function Switch({ checked, ...rest }: Properties) {
    let [isChecked, setIsChecked] = useState<boolean>(checked ?? false);

    return (
        <div className={`w-12 h-7 p-1 rounded-md ${isChecked ? "bg-sky-500" : "bg-slate-300/70"} cursor-pointer`} onClick={() => setIsChecked(!isChecked)} {...rest}>
            <div className={`w-1/2 h-full rounded bg-white duration-100 ${isChecked ? "translate-x-full" : ""}`}></div>
        </div>
    );
}