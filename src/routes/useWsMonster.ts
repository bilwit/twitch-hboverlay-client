import { useEffect, useContext } from 'react';
import WsContext from './wsContext';

export interface MonsterData {
  maxHealth: number,
  value: number,
  isPaused: boolean,
  isDead: boolean,
}

function useWsMonster(id: number) {  
  const { isConnected, connectedSocket } = useContext(WsContext);;

  useEffect(() => {
    if (id && isConnected && connectedSocket) {
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
  
      } catch (err) {
        console.log(err);
      }
    }
  }, [id, isConnected])
}

export default useWsMonster;
