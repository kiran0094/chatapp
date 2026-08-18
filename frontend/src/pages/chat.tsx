import React, { useEffect } from 'react'

interface ChatProps {
    webSocket: WebSocket | null;
}


const Chat = ({ webSocket }: ChatProps) => {
    useEffect(() => {
        if (webSocket) {
            webSocket.onmessage = (event) => {
                console.log("Message from server:", event.data);
            };
        }
    }, [webSocket]);
    const handleSendMessage = (message: string) => {
        if (webSocket) {
            webSocket.send(JSON.stringify({ type: "chat", payload: { message } }));
        }   
    }
  return (
    <div className='flex flex-col'>
    </div>
  )
}

export default Chat