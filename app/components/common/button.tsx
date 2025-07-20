import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

interface Properties {
    children: React.ReactNode;
    url?: string;
    classes?: string;
    colors?: string;
    loading?: boolean;
    [key: string]: any;
}

export default function Button({ children, url = "", classes = "", colors = "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white", loading = false, ...rest }: Properties) {  
    const classList = `px-4.75 py-3.25 rounded-full text-[0.8rem] leading-none text-center cursor-pointer select-none transition-all duration-300 relative before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-t before:from-transparent before:via-white/5 before:to-white/20 before:opacity-0 hover:before:opacity-100 after:absolute after:inset-[-1px] after:rounded-full after:bg-gradient-to-b after:from-white/40 after:to-transparent after:opacity-30 after:blur-[0.5px] before:absolute before:inset-[-1px] before:rounded-full before:bg-gradient-to-t before:from-blue-950/40 before:to-transparent before:opacity-30 before:blur-[0.5px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.2),0_8px_16px_rgba(30,64,175,0.25),0_2px_4px_rgba(30,64,175,0.1)] hover:shadow-[0_12px_24px_rgba(30,64,175,0.3),0_4px_8px_rgba(30,64,175,0.2)] hover:-translate-y-0.5 active:shadow-[0_4px_8px_rgba(30,64,175,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)] active:translate-y-0 active:scale-[0.98] backdrop-blur-sm backdrop-saturate-150 ${colors} ${classes.length && classes}`;
    const contentClassList = "relative z-10 flex items-center justify-center gap-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]";

    return url.length ? (
        <Link href={url} className={classList} draggable={false} {...rest}>
            <span className={contentClassList}>
                {loading ? <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /> : children}
            </span>
        </Link>
    ) : (
        <button className={classList} draggable={false} {...rest}>
            <span className={contentClassList}>
                {loading ? <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /> : children}
            </span>
        </button>
    );
}