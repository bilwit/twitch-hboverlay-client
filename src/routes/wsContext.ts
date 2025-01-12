import { createContext } from "react";

interface IntWsContext {
  isConnected: boolean,
  connectedSocket: WebSocket | undefined,
}

const WsContext = createContext<IntWsContext>({
  isConnected: false,
  connectedSocket: undefined,
});

export default WsContext;
