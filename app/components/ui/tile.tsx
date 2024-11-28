import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Properties {
    icon: any;
    children: React.ReactNode;
    [key: string]: any;
}

export default function Tile({ icon, children, ...rest }: Properties) {
    return (
        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400 select-none" {...rest}>
            <div className="bg-white w-7 h-7 rounded-full text-sm grid place-items-center"><FontAwesomeIcon icon={icon} /></div>
            <div className="mt-2.5 text-sm leading-tight w-full">{children}</div>
        </div>
    );
}