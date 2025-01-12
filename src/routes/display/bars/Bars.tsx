import { useParams } from "react-router-dom";
import useGetData from "../../management/useGetData";
import Themes from "./themes";

function Bars() {
  const params = useParams();
  const { isLoading, data: monsters } = useGetData('monsters/base', params?.['*']);

  return (
    <>
      {!isLoading && monsters && monsters.length === 1 && (
        <Themes 
          monster={monsters?.[0]} 
        />
      )}
    </>
  );
}

export default Bars;
