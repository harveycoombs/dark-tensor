import { motion } from "framer-motion";

interface Properties {
    title: string;
    children: React.ReactNode;
    onClose: any;
    [key: string]: any;
}

export default function Popup({ title, children, onClose, ...rest }: Properties) {
    return (
        <div id="popup" className="fixed inset-0 w-screen h-screen z-50 bg-slate-950/55 grid place-items-center" onClick={(e: any) => {if (e.target.matches("#popup")) onClose() }}>
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" }}} className="p-3 bg-white rounded-md" {...rest}>
                    <div className="">
                        <strong className="">{title}</strong>
                        <button className="" onClick={onClose}></button>
                    </div>
                    {children}
            </motion.div>
        </div>
    );
}