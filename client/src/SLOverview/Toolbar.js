import "../Styles.css";
import { useState } from "react";
import CreateShoppingListForm from "./SLAddShoppingList.js";

function Toolbar({ handleCreate, showArchived, setShowArchived }) {
  const [show, setShow] = useState(false);

  return (
    <div className="toolbar">
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button className="success-buttons" onClick={() => setShow(true)}>
          Create
        </button>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="list-name">Your Shopping Lists</span>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          className="toggle-buttons"
          onClick={() => setShowArchived((current) => !current)}
        >
          {showArchived ? "Show Active" : "Show Archived"}
        </button>
      </div>
      <CreateShoppingListForm
        show={show}
        handleClose={() => setShow(false)}
        handlerMap={{ createShoppingList: handleCreate }}
      />
    </div>
  );
}

export default Toolbar;
