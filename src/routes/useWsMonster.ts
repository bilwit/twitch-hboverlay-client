import { useState, useEffect, useContext } from 'react';
import WsContext from './wsContext';

export interface ReturnData {
  data: MonsterData,
}

export interface MonsterData {
  [key: number]: {
    maxHealth: number,
    value: number,
    isPaused: boolean,
  }
}

function useWsMonster(id: number): ReturnData {  
  const { connectedSocket } = useContext(WsContext);
  const [data, setData] = useState<MonsterData>({});

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

          if (data?.update) {
            setData((prev) => ({
              ...prev,
              [data?.update?.id]: data?.update?.value,
            }));
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
