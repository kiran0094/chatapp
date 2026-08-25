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
        <div className='flex min-h-screen justify-center items-center'>
            <div className='min-h-full w-[80%] sm:w-[40%]'>
                <h1 className='text-4xl font-bold mb-4 mt-4 text-center font-serif'>Chat Room</h1>
                <div className='flex  flex-col space-y-4 bg-[#E8E1D8] p-8 text-white rounded-2xl h-[450px] mb-16'>
                     <div className='flex flex-col space-y-4 flex-1 overflow-y-auto'>

                    {messages.map((msg, index) => (
                        <div key={index} className={`px-3 py-2 rounded ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end rounded-br-none' : 'bg-white text-black self-start rounded-bl-none'}`}>
                            {msg.content}
                        </div>
                    ))}
                    </div>
                    <div className='flex space-x-1'>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        className='border placeholder:text-gray-500 placeholder:italic w-full border-l-4 border-l-blue-400 border-blue-400 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black'
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage((e.currentTarget as HTMLInputElement).value);
                            }
                        }}
                    />
                    <button
                        className='bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
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