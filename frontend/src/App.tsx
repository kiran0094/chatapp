import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [message, setMessage] = useState('');
  const[socket,setSocket]=useState();
  useEffect(()=>{
    const ws= new WebSocket("ws://localhost:8080/");
    setSocket(ws);

    ws.onmessage=(event)=>{
      console.log(event.data);
    }
  
  },[])



  return (
    <>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </>
  )
}

export default App
