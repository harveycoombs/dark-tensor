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
        <div className={`p-4 bg-gray-100/90 rounded-xl text-gray-400 backdrop-blur-lg border border-white/10 select-none cursor-pointer duration-300 shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.2),inset_1px_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] ${classes?.length ? " " + classes : ""} hover:-translate-y-1 hover:shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.2),inset_1px_1px_2px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.15)] hover:bg-gray-100/95 active:translate-y-0 active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]`} {...rest}>
            <div className="bg-white/80 w-8 h-8 rounded-xl text-sm grid place-items-center pointer-events-none shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.4),inset_1px_1px_2px_rgba(0,0,0,0.1)] backdrop-blur-sm">
                <FontAwesomeIcon icon={icon} className="text-gray-500" />
            </div>
            <div className="mt-3 text-sm leading-tight pointer-events-none w-full">{children}</div>
        </div>
    );
}