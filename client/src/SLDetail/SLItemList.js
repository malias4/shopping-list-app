import { useContext } from "react";
import { SLDetailContext } from "./SLDetailProvider";
import Item from "./SLItem";

function ItemList() {
  const { data, handlerMap } = useContext(SLDetailContext);

  if (!data) return null;

  return (
    <div>
      {data.itemList.map((item) => (
        <Item key={item.id} data={item} handlerMap={handlerMap} />
      ))}
    </div>
  );
}

export default ItemList;
