import { useState, useEffect } from 'react';

export interface ReturnData {
  isConnected: boolean,
  connectedSocket?: WebSocket,
}

function useWsConnection(): ReturnData {  
  // isConnected is the Twitch IRC status, not the server WS connection
  const [isConnected, setIsConnected] = useState(false);
  const [connectedSocket, setConnectedSocket] = useState<WebSocket>();

  useEffect(() => {
    const socket = new WebSocket('/wss');

    if (socket) {
      try {
        socket.onopen = () => {
          socket.send(JSON.stringify({ 
            message: 'subscribe',
            data: 'twitch-chat',
            channels: ['connection-status'],
          }));

          socket.send(JSON.stringify({ 
            message: 'connection-status',
          }));
        }

        socket.onmessage = (e: any) => {
          const data = JSON.parse(e?.data);

          if (data.message === 'connection-status') {
            setIsConnected(data?.data === true);
          }
        }
        
        setConnectedSocket(socket);
  
      } catch (err) {
        console.log(err);
      }
    }
  }, [])

  return {
    isConnected,
    connectedSocket,
  }
}

export default useWsConnection;
