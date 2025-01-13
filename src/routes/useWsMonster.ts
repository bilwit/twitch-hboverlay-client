import { useState, useEffect, useContext } from 'react';
import WsContext from './wsContext';

export interface ReturnData {
  data: MonsterData | undefined,
}

export interface MonsterData {
  maxHealth: number,
  value: number,
  isPaused: boolean,
  isDead: boolean,
}

function useWsMonster(id: number): ReturnData {  
  const { connectedSocket } = useContext(WsContext);
  const [data, setData] = useState<MonsterData>();

  useEffect(() => {
    if (connectedSocket) {
      try {  
        connectedSocket.send(JSON.stringify({ 
          message: 'current',
          id: id,
        }));

        connectedSocket.send(JSON.stringify({ 
          message: 'subscribe',
          data: 'twitch-chat',
          channels: [id],
        }));
  
        connectedSocket.onmessage = (e: any) => {
          const data = JSON.parse(e?.data);
          
          switch (data.message) {
            default:
              break;
            case 'update':
              if (data?.data?.id === id) {
                setData(data?.data?.value);
              }
              break;
          }
        }
  
      } catch (err) {
        console.log(err);
      }
    }
  }, [])

  return {
    data,
  }
}

export default useWsMonster;
