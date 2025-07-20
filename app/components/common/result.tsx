import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

interface Properties {
    data: any;
    [key: string]: any;
}

export default function SearchResult({ data, ...rest }: Properties) {
    if (!data.url) return null;

    return (
        <Link href={data.url} className="block p-3 bg-gray-50 text-gray-500 rounded-xl mt-2.5 duration-200 hover:bg-gray-100" target="_blank" rel="noopener" {...rest}>
            <div className="flex items-center gap-2">
                <div className="w-4.5 h-4.5 bg-gray-300/60 rounded-sm inline-grid place-items-center">{data.icon ? <img src={data.icon} alt={data.title} width={14} height={14} /> : <FontAwesomeIcon icon={faGlobe} className="text-xs text-gray-400" />}</div>
                <strong className="block font-semibold">{data.title}</strong>
            </div>

            <div className="block text-sm mt-1 text-gray-400">{data.summary}</div>
        </Link>
    );
}