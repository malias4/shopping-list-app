import { useContext } from "react";
import { SLDetailContext } from "./SLDetailProvider";
import Item from "./SLItem";

function ItemList() {
  const { data, handlerMap } = useContext(SLDetailContext);

  return (
    <div>
      <div style={{ margin: "8px", padding: "8px" }}>
        {data.itemList.map((item) => (
          <Item key={item.id} data={item} handlerMap={handlerMap} />
        ))}
      </div>
    </div>
  );
}

export default ItemList;
