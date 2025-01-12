import { useState, useEffect } from 'react';

export interface ReturnData {
  isConnected: boolean,
  connectedSocket?: WebSocket,
}

function useWsConnection(): ReturnData {  
  const [isConnected, setIsConnected] = useState(false);
  const [connectedSocket, setConnectedSocket] = useState<WebSocket>();

  useEffect(() => {
    const socket = new WebSocket('/wss');

    if (socket) {
      try {  
        socket.onopen = () => {
          setIsConnected(true);
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
