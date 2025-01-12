import { useParams } from "react-router-dom";
import useGetData from "../../management/useGetData";
import Themes from "./themes";
import MonsterContext from "../../management/monsters/MonsterContext";
import useWsMonster from "../../useWsMonster";

function Bars() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);
  const { data } = useWsMonster(Number(params?.['*']));
  
  return (
    <>
      <MonsterContext.Provider value={{ data }}>
        {!isLoading && monsters && monsters.length === 1 && (
          <Themes 
            monster={monsters?.[0]} 
          />
        )}
      </MonsterContext.Provider>
    </>
  );
}

export default Bars;
