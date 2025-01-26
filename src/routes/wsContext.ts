import { createContext } from "react";
import { MonsterDict } from "./useWsConnection";

interface IntWsContext {
  isConnected: boolean,
  connectedSocket: WebSocket | undefined,
  data: MonsterDict | undefined,
}

const WsContext = createContext<IntWsContext>({
  isConnected: false,
  connectedSocket: undefined,
  data: undefined,
});

export default WsContext;
