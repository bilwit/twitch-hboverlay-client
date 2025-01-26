import { useState, useEffect } from 'react';
import { MonsterData } from './useWsMonster';

export interface ReturnData {
  isConnected: boolean,
  connectedSocket?: WebSocket,
  data: MonsterDict,
}

export interface MonsterDict {
  [key: number]: MonsterData,
}

function useWsConnection(): ReturnData {  
  // isConnected is the Twitch IRC status, not the server WS connection
  const [isConnected, setIsConnected] = useState(false);
  const [connectedSocket, setConnectedSocket] = useState<WebSocket>();
  const [data, setData] = useState<MonsterDict>({});

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

        // cannot have multiples listeners throughout the component tree, all incoming messages
        // must be caught and dipensed in one place
        socket.onmessage = (e: any) => {
          const data = JSON.parse(e?.data);

          switch (data.message) {
            default:
              break;
            
            case 'connection-status':
              setIsConnected(data?.data === true);
              break;

            case 'update':
              if (data?.data?.id) {
                setData((prev) => ({
                  ...prev,
                  [data.data.id]: data?.data?.value,
                }));
              }
              break;
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
    data,
  }
}

export default useWsConnection;
