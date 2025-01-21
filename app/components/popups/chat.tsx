import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

import Popup from "@/app/components/common/popup";
import Button from "@/app/components/common/button";
import Field from "@/app/components/common/field";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faClockRotateLeft, faDownload, faEllipsis, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { getModelCleanName } from "@/data/utils";

interface Properties {
    model?: string;
    onClose: () => void;
}

export default function ChatPopup({ model, onClose }: Properties) {
    const [prompt, setPrompt] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    const [conversationid, setConversationID] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);
    const [historyloading, setHistoryLoading] = useState<boolean>(false);

    const [conversationHistory, setConversationHistory] = useState<React.JSX.Element|null>(null);
    const [conversationHistoryIsVisible, setConversationHistoryVisibility] = useState<boolean>(false);

    const chatArea = useRef<HTMLDivElement>(null);
    const promptField = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!loading) return;

        (async () => {
            const response = await fetch("/api/chat", {
                method: "POST",
                body: new URLSearchParams({ messages: JSON.stringify(messages) })
            });

            const data = await response.json();

            if (!response.ok) return;

            setMessages([...messages, {
                content: data.text,
                you: false,
                interval: data.interval,
                timestamp: new Date()
            }]);

            await updateConversation();

            chatArea.current?.scrollTo(0, chatArea?.current?.scrollHeight ?? 0);

            setLoading(false);
        })();
    }, [loading]);

    useEffect(() => {
        if (!historyloading) return;

        (async () => {
            try {
                const response = await fetch("/api/chat");
                const json = await response.json();

                setHistoryLoading(false);

                if (!response.ok) {
                    setConversationHistory(<div className="mt-1.5 text-sm text-red-500">Something went wrong</div>);
                    return;
                }

                setConversationHistory(json.history.map((conversation: any, index: number) => <Conversation key={index} data={conversation} onClick={() => setMessages(JSON.parse(conversation.messages ?? "[]"))} />));
            } catch {
                setHistoryLoading(false);
                setConversationHistory(<div className="mt-1.5 text-sm text-red-500">Something went wrong</div>);
            }

        })();
    }, [historyloading]);

    function startNewConversation() {
        setPrompt("");
        setMessages([]);
        setConversationID(0);
    }

    async function updateConversation() {
        setLoading(true);

        const response = await fetch("/api/chat", {
            method: "PATCH",
            body: new URLSearchParams({ messages: JSON.stringify(messages), conversationid: conversationid.toString() })
        });

        const data = await response.json();

        if (!response.ok) return;

        setConversationID(data.conversationid);
    }

    function sendMessage(e: any) {
        if (e.type == "keyup" && e.key != "Enter") return;
        
        if (!prompt.length) return;

        setMessages([...messages, {
            content: prompt,
            you: true,
            timestamp: new Date()
        }]);

        if (promptField?.current) {
            promptField.current.blur();
            setPrompt("");
        }

        setLoading(true);
    }

    function openConversationHistory() {
        setHistoryLoading(!conversationHistoryIsVisible);
        setConversationHistoryVisibility(!conversationHistoryIsVisible);
    }

    return (
        <Popup title="Chat" onClose={onClose}>
            <div className={`w-1300 flex${conversationHistoryIsVisible ? " gap-3" :""}`}>
                <div className="w-full pt-2.5">
                    <div className="flex justify-between items-center text-sm relative z-10 pb-2.5 shadow-[0_0_6px_6px_white]">
                        <div className="text-slate-400/60">Model: <strong className="font-bold text-slate-600">{getModelCleanName(model ?? "deepseek-v2:lite")}</strong></div>
                        <div>
                            <ChatOption icon={faPlus} title="New Conversation" onClick={startNewConversation} />
                            <ChatOption icon={faClockRotateLeft} title="View Conversation History" onClick={openConversationHistory} selected={conversationHistoryIsVisible} />
                            <ChatOption icon={faDownload} title="Download Conversation Transcript" />
                        </div>
                    </div>
                    <div className={`h-1/2-screen overflow-auto ${messages.length ? "" : "grid place-items-center pointer-events-none"}`} ref={chatArea}>{
                        messages.length ? messages.map((message, index) => <ChatMessage key={index} message={message} />)
                        : <div className="text-center"><strong className="text-xl text-slate-400/60 font-semibold">Welcome to Chat</strong><div className="text-xs text-slate-400 mt-1.5">Start a conversation by typing a message below</div></div>
                    }
                    {loading ? <div className="px-3 py-0.5 mt-4 text-lg max-w-23/50 rounded-lg bg-sky-400 text-white w-fit mb-5"><FontAwesomeIcon icon={faEllipsis} className="animate-pulse" /></div> : null}
                    </div>
                    <div className="flex gap-3 py-3 shadow-[0_0_6px_6px_white]">
                        <Field classes="w-full" onInput={(e: any) => setPrompt(e.target.value)} value={prompt} onKeyUp={sendMessage} ref={promptField} />
                        <Button onClick={sendMessage} disabled={loading}>Send</Button>
                    </div>
                </div>
                <motion.div className="w-56 shrink-0 overflow-hidden" initial={{ width: conversationHistoryIsVisible ? "0px" : "256px" }} animate={{ width: conversationHistoryIsVisible ? "256px" : "0px" }} transition={{ duration: 0.25, ease: "easeInOut" }}>
                    <div className="w-full h-full pl-3 pt-2.5 border-l border-l-slate-300">
                        <strong className="block text-sm font-semibold">History</strong>
                        {historyloading ? <div className="text-slate-400/60 mt-1.5">
                            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin leading-none inline-block align-middle" />
                            <span className="text-sm leading-none inline-block align-middle font-medium ml-1.5">Loading</span>
                        </div> : conversationHistory}
                    </div>
                </motion.div>
            </div>
        </Popup>
    );
}

function ChatMessage({ message, ...rest }: any) {
    return (
        <div className={`w-5/12 mt-4 ${message.you ? "ml-auto" : "mr-auto"}`}>
            <div className={`px-3 py-2 text-sm max-w-23/50 rounded-lg ${message.you ? "bg-slate-100 text-slate-400" : "bg-sky-400 text-white"}`} {...rest}>{message.content.split("\n").map((line: string, index: number) => <span key={index}>{line}<br/></span>)}</div>
            <div className="text-xs text-slate-400 mt-1" title={message.timestamp.toLocaleString()}>{message.timestamp.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit" })}{!message.you ? <> &middot; Thought for {Math.round(message.interval / 1000
            )} seconds</> : null}</div>
        </div>
    );
}

function ChatOption({ icon, selected, ...rest }: any) {
    return <div className={`inline-block align-middle ml-3.5 text-base cursor-pointer duration-100 ${selected ? "text-slate-400" : "text-slate-400/60"} hover:text-slate-400 active:text-slate-500`} {...rest}><FontAwesomeIcon icon={icon} /></div>
}

function Conversation({ data, ...rest }: any) {
    return (
        <div className="px-2 py-1 rounded-md mt-1 cursor-pointer duration-100 hover:bg-slate-50 active:bg-slate-100/85" {...rest}>
            <div className="text-sm leading-snug font-semibold">{data.summary}</div>
            <div className="text-xs mt-1 text-slate-400/60">{new Date(data.start_date).toLocaleString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
        </div>
    );
}