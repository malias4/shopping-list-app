import { useContext, useState } from "react";
import { SLDetailContext } from "./SLDetailProvider";
import { UserContext } from "../Users/UserProvider";
import UpdateName from "./SLNameEdit";
import "../Styles.css";

function Toolbar() {
  const [show, setShow] = useState(false);
  const { data, handlerMap, showResolved, toggleShowResolved } =
    useContext(SLDetailContext);
  const { loggedInUser } = useContext(UserContext);

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
        <button
          className="success-buttons"
          onClick={() => handlerMap.addItem()}
        >
          Add Item
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
        <span className="list-name">{data.name}</span>
        {loggedInUser === data.owner && (
          <button
            className="edit-buttons"
            onClick={() => setShow(true)}
            style={{ marginLeft: "10px" }}
          >
            Edit
          </button>
        )}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button className="toggle-buttons" onClick={() => toggleShowResolved()}>
          {showResolved ? "Not Checked Only" : "All Items"}
        </button>
      </div>
      <UpdateName
        show={show}
        handleClose={() => setShow(false)}
        data={data}
        handlerMap={handlerMap}
      />
    </div>
  );
}

export default Toolbar;
