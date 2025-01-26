import useGetData, { Monster, Stage } from "../../management/useGetData";
import { useContext, useEffect, useState } from 'react';
import MonsterContext from "../../management/monsters/MonsterContext";

interface Props {
  data: Monster,
}

function Item(props: Props) {
  const { 
    isLoading,
    data: stages, 
  } = useGetData('monsters/stages', String(props.data.id));
  const { data } = useContext(MonsterContext);
  const [sorted, setSorted] = useState<Stage[]>([]);

  useEffect(() => {
    if (stages) {
      setSorted(stages.sort((a, b) => a.hp_value < b.hp_value ? -1 : 1));
    }
  }, [stages]);

  const displayHealth = () => {
    const percentage = data ? data?.value / data?.maxHealth * 100 : 0;

    for (const stage of sorted) {
      if (percentage <= stage.hp_value) {
        return (
          <img
            src={window.location.origin + '/api/avatar/' + stage.avatar_url}
            alt={props?.data.name + ' Avatar'}
          />
        );
      }
    }

    return (
      <img
        src={window.location.origin + '/api/avatar/' + props?.data.avatar_url}
        alt={props?.data.name + ' Avatar'}
      />
    );
  }

  return (
    <>
      {!isLoading && props?.data && (
        <>
        {displayHealth()}
        </>
      )}
    </>
  );
}

export default Item;
