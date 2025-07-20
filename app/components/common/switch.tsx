import { useState } from "react";

interface Properties {
    checked?: boolean;
    reference: React.RefObject<HTMLInputElement>;
}

export default function Switch({ checked, reference, ...rest }: Properties) {
    let [isChecked, setIsChecked] = useState<boolean>(checked ?? false);

    return (
        <div className={`w-12 h-7 p-1 rounded-md ${isChecked ? "bg-blue-500" : "bg-gray-300/70"} cursor-pointer`} onClick={() => setIsChecked(!isChecked)} {...rest}>
            <div className={`w-1/2 h-full rounded-sm bg-white duration-200 ${isChecked ? "translate-x-full" : ""}`}></div>
            <input type="checkbox" className="hidden" checked={isChecked} onChange={() => setIsChecked(!isChecked)} ref={reference} />
        </div>
    );
}