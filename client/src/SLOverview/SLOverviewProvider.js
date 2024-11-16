import { useMemo, useState, useContext } from "react";
import { UserContext } from "../Users/UserProvider.js";
import ToDoListOverviewList from "./SLOverviewList.js";
import Toolbar from "./Toolbar.js";
import ObjectId from "bson-objectid";

function OverviewProvider() {
  const [showArchived, setShowArchived] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  const [toDoListOverviewList, setToDoListOverviewList] = useState([
    {
      id: "6738c511bbc9eb11977aff92",
      name: "Shopping List 1",
      state: "active",
      owner: "u1",
      memberList: ["u2"],
    },
    {
      id: "6738c513bbc9eb11977aff93",
      name: "Shopping List 2",
      state: "archived",
      owner: "u1",
      memberList: ["u2", "u3"],
    },
    {
      id: "6738c514bbc9eb11977aff94",
      name: "Shopping List 3",
      state: "active",
      owner: "u3",
      memberList: [],
    },
    {
      id: "6738c4f9bbc9eb11977aff8f",
      name: "Shopping List 4",
      state: "archived",
      owner: "u2",
      memberList: ["u1"],
    },
  ]);

  function handleCreate(name) {
    setToDoListOverviewList((current) => {
      current.push({
        id: ObjectId().toString(),
        name: name,
        state: "active",
        owner: loggedInUser,
        memberList: [],
      });
      return current.slice();
    });
  }

  function handleArchive(dtoIn) {
    setToDoListOverviewList((current) => {
      const itemIndex = current.findIndex((item) => item.id === dtoIn.id);
      current[itemIndex] = { ...current[itemIndex], state: "archived" };
      return current.slice();
    });
  }

  function handleDelete(dtoIn) {
    setToDoListOverviewList((current) => {
      const itemIndex = current.findIndex((item) => item.id === dtoIn.id);
      current.splice(itemIndex, 1);
      return current.slice();
    });
  }

  const filteredToDoListList = useMemo(() => {
    if (showArchived) {
      return toDoListOverviewList.filter(
        (item) =>
          item.owner === loggedInUser || item.memberList?.includes(loggedInUser)
      );
    } else {
      return toDoListOverviewList.filter(
        (item) =>
          item.state === "active" &&
          (item.owner === loggedInUser ||
            item.memberList?.includes(loggedInUser))
      );
    }
  }, [showArchived, toDoListOverviewList, loggedInUser]);

  return (
    <>
      <Toolbar
        handleCreate={handleCreate}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />
      <ToDoListOverviewList
        toDoListOverviewList={filteredToDoListList}
        handleArchive={handleArchive}
        handleDelete={handleDelete}
      />
    </>
  );
}

export default OverviewProvider;
