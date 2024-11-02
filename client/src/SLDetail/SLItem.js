import { useState } from "react";
import "../Styles.css";

function Item({ data, handlerMap }) {
  const [value, setValue] = useState(data.name);

  return (
    <div className="item-container">
      <button
        className={`resolve-buttons ${data.resolved ? "true" : "false"}`}
        onClick={() => handlerMap.toggleResolveItem({ id: data.id })}
      >
        {data.resolved ? "Uncheck" : "Check"}
      </button>
      <input
        type="text"
        value={value}
        placeholder="Type here"
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => handlerMap.updateItemName({ id: data.id, name: value })}
      />
      <button
        className="remove-buttons"
        onClick={() => handlerMap.deleteItem({ id: data.id })}
      >
        Remove
      </button>
    </div>
  );
}

export default Item;
