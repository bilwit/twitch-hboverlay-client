import Item from './Item';
import { useParams } from "react-router-dom";
import useGetData from "../../management/useGetData";
import useWsMonster from '../../useWsMonster';
import MonsterContext from '../../management/monsters/MonsterContext';

function Bars() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);
  const { data } = useWsMonster(Number(params?.['*']));

  return (
    <MonsterContext.Provider value={{ data }}>
      <div style={{ backgroundColor: 'transparent' }}>
        {!isLoading && monsters && monsters.length === 1 && monsters.map((item) => (
          <Item 
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </MonsterContext.Provider>
  );
}

export default Bars;
