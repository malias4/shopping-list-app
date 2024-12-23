import { createContext, useMemo, useState, useContext, useEffect } from "react";
import { UserContext } from "../Users/UserProvider.js";
import FetchHelper from "../FetchHelper.js";

export const OverviewContext = createContext();

function OverviewProvider({ children }) {
  const { loggedInUser } = useContext(UserContext);

  const [showArchived, setShowArchived] = useState(false);

  const [overviewDataLoader, setOverviewDataLoader] = useState({
    state: "ready",
    data: [],
    error: null,
  });

  async function handleLoad() {
    setOverviewDataLoader((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper().shoppingList.list();
    console.log("Fetched data:", result); // Debugging log
    setOverviewDataLoader((current) => {
      if (result.ok) {
        return {
          ...current,
          state: "ready",
          data: Array.isArray(result.data.shoppingLists)
            ? result.data.shoppingLists
            : [],
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  useEffect(() => {
    handleLoad();
  }, [loggedInUser]);

  async function handleCreate(dtoIn) {
    setOverviewDataLoader((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper().shoppingList.create(
      {
        listName: dtoIn.name,
      },
      loggedInUser
    );
    handleLoad();
  }

  async function handleArchive(dtoIn) {
    setOverviewDataLoader((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper().shoppingList.archive(
      {
        id: dtoIn.id,
        isArchived: true,
      },
      loggedInUser
    );
    handleLoad();
  }

  async function handleDelete(dtoIn) {
    setOverviewDataLoader((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper().shoppingList.delete(
      {
        listId: dtoIn.id,
      },
      loggedInUser
    );
    handleLoad();
  }

  const filteredShoppingListList = useMemo(() => {
    console.log("Filtering data:", overviewDataLoader.data); // Debugging log
    console.log("Logged in user:", loggedInUser); // Debugging log
    if (showArchived) {
      return overviewDataLoader.data?.filter(
        (item) =>
          item.ownerId === loggedInUser ||
          item.memberIdList?.includes(loggedInUser)
      );
    } else {
      return overviewDataLoader.data?.filter(
        (item) =>
          (item.ownerId === loggedInUser ||
            item.memberIdList?.includes(loggedInUser)) &&
          !item.isArchived
      );
    }
  }, [overviewDataLoader.data, showArchived, loggedInUser]);

  console.log("Filtered data:", filteredShoppingListList); // Debugging log

  const value = {
    state: overviewDataLoader.state,
    error: overviewDataLoader.error,
    data: filteredShoppingListList,
    handlerMap: {
      handleLoad,
      handleCreate,
      handleArchive,
      handleDelete,
    },
    showArchived,
    setShowArchived, // Ensure setShowArchived is included in the context value
    toggleShowArchived: () => setShowArchived((current) => !current),
  };

  return (
    <OverviewContext.Provider value={value}>
      {children}
    </OverviewContext.Provider>
  );
}

export default OverviewProvider;
