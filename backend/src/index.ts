import {WebSocketServer,WebSocket} from "ws";

interface User{
    socket:WebSocket;
    roomId:string;
}

const wss =new WebSocketServer({
    port:8080
})
let userCount=0;
let allSocket:User[]=[];
wss.on("connection",(socket)=>{
    userCount=userCount+1;    
    socket.on("message",(mes)=>{
        console.log("message received from client: ");
        const parsedMessage=JSON.parse(mes.toString());
        console.log(parsedMessage);
         if (parsedMessage.type == "join") {
                    allSocket.push({
                          socket: socket,
                          roomId: parsedMessage.payload.roomId
                        });
  
                     console.log("user joined room: " + parsedMessage.payload.roomId);

  // Send a response back to the client so you see it in your client tools:
                    socket.send(JSON.stringify({
                        status: "success",
                        message: `Joined room ${parsedMessage.payload.roomId}`
                    }));
                    }


        if(parsedMessage.type.toLowerCase()=="chat"){
            const currentRoomId=allSocket.find((s)=>s.socket===socket)?.roomId;

            
            allSocket.forEach((s)=>{
                if(s.roomId===currentRoomId && s.socket!==socket){
                    s.socket.send(JSON.stringify({
                        status: "receiver",                        
                        message: parsedMessage.payload.message
                        
                    }));
                }
            })
        }
    }) 

})