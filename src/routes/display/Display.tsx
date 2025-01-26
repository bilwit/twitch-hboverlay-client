import { Route, Routes } from "react-router-dom";
import Bars from './bars';
import Avatars from "./avatars";
import useWsConnection from "../useWsConnection";
import WsContext from "../wsContext";

function Display() {  
  const { 
    isConnected, 
    connectedSocket,
    data,
  } = useWsConnection();
  
  return (
    <WsContext.Provider value={{ isConnected, connectedSocket, data }}>
      <Routes>
        <Route
          path="bars/*"
          element={(
            <Bars />
          )}
        />
        <Route
          path="avatars/*"
          element={(
            <Avatars />
          )}
        />
      </Routes>
    </WsContext.Provider>
  );
}

export default Display;
