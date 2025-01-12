import Item from './Item';
import { useParams } from "react-router-dom";
import useGetData from "../../management/useGetData";
import WsContext from '../../wsContext';
import { useContext } from 'react';

function Bars() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);
  const { connectedSocket } = useContext(WsContext);

  return (
    <div style={{ backgroundColor: 'transparent' }}>
      {!isLoading && connectedSocket && monsters && monsters.length === 1 && monsters.map((item) => (
        <Item 
          key={item.id}
          data={item}
        />
      ))}
    </div>
  );
}

export default Bars;
