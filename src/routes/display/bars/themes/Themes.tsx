import BarBasic from "./Basic";
import CounterRaw from "./CounterRaw";
import CounterPercentage from "./CounterPercentage";
import { useContext } from "react";
import MonsterContext from "../../../management/monsters/MonsterContext";

interface Props {
  monster: any,
}

function Themes(props: Props) {
  const { data } = useContext(MonsterContext);

  const theme = (theme: string, isLoading: boolean, value: number, maxHealth: number) => {
    switch (theme) {
      default:
      case 'bar_basic':
        return (
          <BarBasic
            isLoading={isLoading}
            value={value}
            maxHealth={maxHealth}
          />
        );
      case 'counter_raw':
        return (
          <CounterRaw
            isLoading={isLoading}
            value={value}
          />
        );
      case 'counter_percentage':
        return (
          <CounterPercentage
            isLoading={isLoading}
            value={value}
            maxHealth={maxHealth}
          />
        );
    }
  }  
  
  return (
    <>
      {data && theme(props.monster.bar_theme, props.monster.isLoading, data?.value, data?.maxHealth)}
    </>
  );
}

export default Themes;
