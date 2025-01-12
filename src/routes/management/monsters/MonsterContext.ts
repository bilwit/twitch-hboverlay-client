import { createContext } from "react";
import { MonsterData } from "../../useWsMonster";

interface IntMonsterContext {
  data: MonsterData | undefined,
}

const MonsterContext = createContext<IntMonsterContext>({
  data: undefined,
});

export default MonsterContext;
