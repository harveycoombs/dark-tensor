import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Properties {
    icon: IconProp;
    classes?: string;
    children: React.ReactNode;
    [key: string]: any;
}

export default function Tile({ icon, classes, children, ...rest }: Properties) {
    return (
        <div className={`p-2.5 bg-slate-100 rounded-xl text-slate-400 select-none cursor-pointer duration-100 ${classes?.length ? " " + classes : ""} hover:-translate-y-1.5 hover:bg-slate-200/75 active:bg-slate-200/95 active:-translate-y-0.5`} {...rest}>
            <div className="bg-white w-7 h-7 rounded-full text-sm grid place-items-center pointer-events-none"><FontAwesomeIcon icon={icon} /></div>
            <div className="mt-2.5 text-sm leading-tight pointer-events-none w-full">{children}</div>
        </div>
    );
}