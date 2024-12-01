import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface Properties {
    title: string;
    children: React.ReactNode;
    classes?: string;
    onClose: any;
    [key: string]: any;
}

export default function Popup({ title, children, classes, onClose, ...rest }: Properties) {
    return (
        <div id="popup" className="fixed inset-0 w-screen h-screen z-50 bg-slate-950/60 grid place-items-center" onMouseDown={(e: any) => {if (e.target.matches("#popup")) onClose() }}>
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { duration: 0.2, ease: "easeOut" }}} className={`p-3 min-w-96 bg-white rounded-md ${classes?.length ? " " + classes : ""}`} {...rest}>
                    <div className="flex justify-between items-center leading-none">
                        <strong className="text-sm font-semibold">{title}</strong>
                        <button className="text-slate-400/60 cursor-pointer duration-100 hover:text-slate-400 active:text-slate-500" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
                    </div>
                    {children}
            </motion.div>
        </div>
    );
}