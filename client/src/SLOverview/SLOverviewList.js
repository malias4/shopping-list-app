import OverviewItem from "./SLOverviewItem";
import "../Styles.css";

function OverviewList({ toDoListOverviewList, handleArchive, handleDelete }) {
  return (
    <div className="tiles-container">
      {toDoListOverviewList.map((toDoList) => (
        <OverviewItem
          key={toDoList.id}
          toDoList={toDoList}
          handleArchive={handleArchive}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default OverviewList;
