import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Chat from './pages/chat';

function App() {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/");

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      console.log(event.data);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const handleJoinRoom = (roomId: string) => {
    if (socket) {
      socket.send(JSON.stringify({ type: "join", payload: { roomId } }));
      navigate("/chat");
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
              <h1 className="text-4xl font-bold mb-4">Welcome to the Chat App</h1>
              <p className="text-lg text-gray-700 mb-8">
                Connect and chat with your friends in real-time!
              </p>
              <div className="flex space-x-4 min-h-[40%]">
                <label htmlFor="roomId" className="text-lg font-semibold">
                  Room ID:
                </label>
                <input
                  type="text"
                  id="roomId"
                  placeholder="Enter Room ID"
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => handleJoinRoom(message)}
                >
                  Join Room
                </button>
              </div>
            </div>
          }
        />
        <Route path="/chat" element={<Chat webSocket={socket} />} />
      </Routes>

      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-4">
        <p className="text-center">Chat App. made with ❤️ kiran.</p>
      </div>
    </>
  )
}

export default App