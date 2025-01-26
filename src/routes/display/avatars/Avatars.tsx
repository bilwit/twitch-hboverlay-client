import Item from './Item';
import { useParams } from "react-router-dom";
import useGetData from "../../management/useGetData";
import useWsMonster from '../../useWsMonster';

function Bars() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);
  
  useWsMonster(Number(params?.['*']));

  return (
    <div style={{ backgroundColor: 'transparent' }}>
      {!isLoading && monsters && monsters.length === 1 && monsters.map((item) => (
        <Item 
          key={item.id}
          data={item}
        />
      ))}
    </div>
  );
}

export default Bars;
