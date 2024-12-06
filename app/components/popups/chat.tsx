import { useEffect, useState } from "react";

import Popup from "@/app/components/ui/popup";
import Button from "@/app/components/ui/button";
import Field from "@/app/components/ui/field";

interface Properties {
    onClose: any;
}

export default function ChatPopup({ onClose }: Properties) {
    let [prompt, setPrompt] = useState<string>("");
    let [messages, setMessages] = useState<any[]>([]);

    /*useEffect(() => {
        (async () => {
            let response = await fetch(encodeURI(`/api/chat?prompt=${prompt}`));
            let data = await response.json();

            if (!response.ok) return;

            setMessages([...messages, data.text]);
        })();
    }, []);*/

    return (
        <Popup title="Chat" onClose={onClose}>
            <div className="w-650 mt-2">
                <div className="flex justify-between items-center text-sm mb-2">
                    <div className="text-slate-400/60">Model: <strong className="font-bold text-slate-600">DeepSeek V2 Lite &#40;15.7B&#41;</strong></div>
                    <div>
                        options will go here
                    </div>
                </div>
                <div className={`h-96 ${messages.length ? "" : "grid place-items-center pointer-events-none"}`}>{
                    messages.length ? messages.map((message, index) => <ChatMessage key={index} message={message} />)
                    : <div className="text-center"><strong className="text-xl text-slate-400/60 font-semibold">Welcome to Chat</strong><div className="text-sm text-slate-400 font-medium mt-1.5">Start a conversation by typing a message below</div></div>
                }</div>
                <div className="flex gap-2">
                    <Field classes="w-full" />
                    <Button>Send</Button>
                </div>
            </div>
        </Popup>
    );
}

function ChatMessage({ message, ...rest }: any) {
    return <div className="" {...rest}>{message.content}</div>;
}