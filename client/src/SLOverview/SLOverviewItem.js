import { useContext } from "react";
import { UserContext } from "../Users/UserProvider.js";
import { useNavigate, createSearchParams } from "react-router-dom";
import "../Styles.css";

function OverviewItem({ toDoList, handleArchive, handleDelete }) {
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this shopping list?")) {
      handleDelete({ id });
    }
  };

  const handleNavigate = () => {
    navigate({
      pathname: "detail",
      search: createSearchParams({ id: toDoList.id }).toString(),
    });
  };

  return (
    <div className="tile-container" onClick={handleNavigate}>
      <span className="tile-title">{toDoList.name}</span>
      {loggedInUser === toDoList.owner ? (
        <div className="tile-actions">
          <button
            className="outline-green-buttons"
            onClick={(e) => {
              e.stopPropagation();
              handleArchive({ id: toDoList.id });
            }}
          >
            Archive
          </button>
          <button
            className="remove-buttons"
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete(toDoList.id);
            }}
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default OverviewItem;
