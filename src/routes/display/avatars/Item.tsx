import useGetData, { Monster, Stage } from "../../management/useGetData";
import { useEffect, useState } from 'react';
import useWsMonster from "../../useWsMonster";

interface Props {
  data: Monster,
}

function Item(props: Props) {
  const { 
    isLoading,
    data: stages, 
  } = useGetData('monsters/stages', String(props.data.id));
  const { data } = useWsMonster(props.data.id);

  const [sorted, setSorted] = useState<Stage[]>([]);

  useEffect(() => {
    if (stages) {
      setSorted(stages.sort((a, b) => a.hp_value < b.hp_value ? -1 : 1));
    }
  }, [stages]);

  const displayHealth = () => {
    const percentage = data ? data?.[props?.data?.id]?.value / data?.[props?.data?.id]?.maxHealth * 100 : 0;

    for (const stage of sorted) {
      if (percentage <= stage.hp_value) {
        return (
          <img
            src={window.location.origin + '/api/avatar/' + stage.avatar_url}
            alt={props.data.name + ' Avatar'}
          />
        );
      }
    }

    return (
      <img
        src={window.location.origin + '/api/avatar/' + props.data.avatar_url}
        alt={props.data.name + ' Avatar'}
      />
    );
  }

  return (
    <>
      {!isLoading && props.data && (
        <>
        {displayHealth()}
        </>
      )}
    </>
  );
}

export default Item;
