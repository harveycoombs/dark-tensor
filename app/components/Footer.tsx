import Link from "next/link";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import packageJson from "@/package.json";

export default function Footer() {
    return (
        <footer className="py-4 flex justify-between items-center border-t border-t-gray-200 text-sm select-none text-gray-400/60 w-340 mx-auto">
            <div>&copy; 2024 &ndash; {new Date().getFullYear()} Dark Tensor {packageJson.version} &middot; <Link href="https://harveycoombs.com/" target="_blank" rel="noopener" className="hover:underline">Harvey Coombs</Link></div>
            <div>
                <FooterIcon icon={faGithub} title="Discord" url="https://github.com/harveycoombs/dark-tensor" />
                <FooterIcon icon={faDiscord} title="Discord" url="https://discord.gg/rguH98UY" />
            </div>
        </footer>
    );
}

function FooterIcon({ icon, title, url }: any) {
    return <Link href={url} title={title} className="inline-block align-middle text-lg leading-none duration-200 ml-3 hover:text-gray-400 active:text-gray-500"><FontAwesomeIcon icon={icon} /></Link>;
}