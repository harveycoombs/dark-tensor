import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

interface Properties {
    data: any;
}

export default function SearchResult({ data }: Properties) {
    return (
        <Link href={data.url} className="block p-3 bg-slate-50 text-slate-500 rounded-xl mt-2.5 duration-100 hover:bg-slate-100">
            <div className="flex items-center gap-2">
                <div className="w-4.5 h-4.5 bg-slate-300/60 rounded inline-grid place-items-center">{data.icon ? <img src={data.icon} alt={data.title} width={14} height={14} /> : <FontAwesomeIcon icon={faGlobe} className="text-xs text-slate-400" />}</div>
                <strong className="block font-semibold">{data.title}</strong>
            </div>
            <div className="block text-sm mt-1 text-slate-400">{data.summary}</div>
        </Link>
    );
}