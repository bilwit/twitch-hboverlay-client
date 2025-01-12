import { useState, useEffect } from 'react';

export interface ReturnData {
  isConnected: boolean,
  connectedSocket?: WebSocket,
  data: MonsterData,
}

export interface MonsterData {
  [key: number]: {
    maxHealth: number,
    value: number,
    isPaused: boolean,
  }
}

function useWsMonster(): ReturnData {  
  const [isConnected, setIsConnected] = useState(false);
  const [connectedSocket, setConnectedSocket] = useState<WebSocket>();
  const [data, setData] = useState<MonsterData>({});

  useEffect(() => {
    const socket = new WebSocket('/wss');

    if (socket) {
      try {  
        socket.onopen = () => {
          setIsConnected(true);

          socket.send(JSON.stringify({ 
            message: 'subscribe',
            data: 'twitch-chat',
            channels: ['update'],
          }));
        }
  
        socket.onmessage = (e: any) => {
          const data = JSON.parse(e?.data);

          if ('status' in data) {
            setIsConnected(data?.status);
          }

          if (data?.update) {
            setData((prev) => ({
              ...prev,
              [data?.update?.id]: data?.update?.value,
            }));
          }
        }
        
        setConnectedSocket(socket);
  
      } catch (err) {
        console.log(err);
      }
    }
  }, [])

  return {
    data,
    isConnected,
    connectedSocket,
  }
}

export default useWsMonster;
