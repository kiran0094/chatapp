import React, { useEffect, useRef, useState } from 'react'

interface ChatProps {
    webSocket: WebSocket | null;
}
interface Message {
    sender: string;
    content: string;
}

const Chat = ({ webSocket }: ChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (webSocket) {
            webSocket.onmessage = (event) => {
                console.log("Message received from server: ", event.data);
                const data = JSON.parse(event.data);
                setMessages((prev) => [...prev, { sender: 'server', content: data.message }]);
            };
        }               
    }, [webSocket]);

    const handleSendMessage = (message: string) => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        setMessages((prev) => [...prev, { sender: 'user', content: trimmedMessage }]);

        if (webSocket) {
            webSocket.send(JSON.stringify({ type: "chat", payload: { message: trimmedMessage } }));
        }

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className='flex min-h-full justify-center items-center'>
            <div>
                <h1 className='text-4xl font-bold mb-4'>Chat Room</h1>
                <div className='flex  flex-col space-y-4'>
                    {messages.map((msg, index) => (
                        <div key={index} className={`p-2 rounded ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
                            {msg.content}
                        </div>
                    ))}
                    <div className='flex space-x-4'>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        className='border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage((e.currentTarget as HTMLInputElement).value);
                            }
                        }}
                    />
                    <button
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onClick={() => {
                            handleSendMessage(inputRef.current?.value ?? "");
                        }}
                    >
                        Send
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat