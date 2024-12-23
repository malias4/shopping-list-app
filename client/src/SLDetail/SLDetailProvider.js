import { createContext, useMemo, useState, useEffect, useContext } from "react";
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import FetchHelper from "../FetchHelper.js";
import { OverviewContext } from "../SLOverview/SLOverviewProvider.js";
import { UserContext } from "../Users/UserProvider.js";

export const SLDetailContext = createContext();

function DetailProvider({ children }) {
  const { handlerMap } = useContext(OverviewContext);
  const { loggedInUser } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("id");
  const navigate = useNavigate();

  const [detailDataLoader, setDetailDataLoader] = useState({
    state: "ready",
    data: null,
    error: null,
  });

  async function handleLoad() {
    if (!loggedInUser) {
      console.warn("User context not initialized, delaying load");
      return;
    }

    setDetailDataLoader((current) => {
      return {
        ...current,
        state: "pending",
        data: selectedId !== current.data?.id ? null : current.data,
      };
    });
    const result = await FetchHelper().shoppingList.get(
      { id: selectedId },
      loggedInUser
    );

    setDetailDataLoader((current) => {
      if (result.ok) {
        return {
          ...current,
          state: "ready",
          data: result.data.shoppingList, // Access the shoppingList object
          error: null,
        };
      } else {
        console.error("Error loading detail data:", result.data);
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  async function handleUpdate(dtoIn, itemId) {
    setDetailDataLoader((current) => {
      return {
        ...current,
        state: "pending",
        itemId: itemId,
      };
    });

    const result = await FetchHelper().shoppingList.update(dtoIn, loggedInUser);

    setDetailDataLoader((current) => {
      if (result.ok) {
        handlerMap.handleLoad();
        return {
          ...current,
          state: "ready",
          itemId: null,
          data: result.data.shoppingList, // Access the shoppingList object
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  async function handleStatusUpdate(dtoIn, itemId) {
    setDetailDataLoader((current) => {
      return {
        ...current,
        state: "pending",
        itemId: itemId,
      };
    });

    const result = await FetchHelper().shoppingList.statusItem(
      dtoIn,
      loggedInUser
    );

    setDetailDataLoader((current) => {
      if (result.ok) {
        handlerMap.handleLoad();
        return {
          ...current,
          state: "ready",
          itemId: null,
          data: result.data.shoppingList, // Access the shoppingList object
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  async function handleDelete(dtoIn) {
    setDetailDataLoader((current) => {
      return {
        ...current,
        state: "pending",
      };
    });

    const result = await FetchHelper().shoppingList.deleteItem(
      dtoIn,
      loggedInUser
    );

    setDetailDataLoader((current) => {
      if (result.ok) {
        handlerMap.handleLoad();
        return {
          ...current,
          state: "ready",
          data: result.data.shoppingList, // Access the shoppingList object
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });

    navigate({
      search: createSearchParams({}).toString(),
    });
  }

  useEffect(() => {
    if (selectedId && loggedInUser) handleLoad();
  }, [selectedId, loggedInUser]);

  const [showResolved, setShowResolved] = useState(false);

  const filteredData = useMemo(() => {
    if (detailDataLoader.data) {
      const result = { ...detailDataLoader.data };
      if (!showResolved) {
        result.itemList = result?.itemList?.filter((item) => !item.resolved);
      }
      return result;
    } else {
      return undefined;
    }
  }, [detailDataLoader.data, showResolved]);

  const value = {
    state: detailDataLoader.state,
    error: detailDataLoader.error,
    itemId: detailDataLoader.itemId,
    data: filteredData,
    handlerMap: {
      handleLoad,
      handleUpdate,
      handleStatusUpdate,
      handleDelete,
      addItem: async () => {
        const dtoIn = {
          listId: detailDataLoader.data._id,
          itemName: "",
        };
        console.log("Adding item:", dtoIn);
        const result = await FetchHelper().shoppingList.addItem(
          dtoIn,
          loggedInUser
        );
        console.log("Add item result:", result);
        if (result.ok) {
          setDetailDataLoader((current) => {
            current.data.itemList.push(
              result.data.shoppingList.itemList.slice(-1)[0]
            );
            return JSON.parse(JSON.stringify(current));
          });
        } else {
          console.error("Error adding item:", result.data);
        }
      },
      updateItemName: async ({ id, name }) => {
        const itemIndex = detailDataLoader.data.itemList.findIndex(
          (item) => item.id === id
        );
        detailDataLoader.data.itemList[itemIndex] = {
          ...detailDataLoader.data.itemList[itemIndex],
          itemName: name,
        };
        const dtoIn = {
          listId: detailDataLoader.data._id,
          itemId: id,
          itemName: name,
        };
        const result = await FetchHelper().shoppingList.updateItem(
          dtoIn,
          loggedInUser
        );
        console.log("Update item name result:", result);
        if (result.ok) {
          setDetailDataLoader((current) => {
            current.data.itemList[itemIndex].itemName = name;
            return JSON.parse(JSON.stringify(current));
          });
        } else {
          console.error("Error updating item name:", result.data);
        }
      },
      toggleResolveItem: async ({ id }) => {
        const itemIndex = detailDataLoader.data.itemList.findIndex(
          (item) => item.id === id
        );
        const isResolved = !detailDataLoader.data.itemList[itemIndex].resolved;
        detailDataLoader.data.itemList[itemIndex].resolved = isResolved;
        handleStatusUpdate(
          {
            listId: detailDataLoader.data._id,
            itemId: id,
            isResolved: isResolved,
          },
          id
        );
      },
      deleteItem: async ({ id }) => {
        const dtoIn = { listId: detailDataLoader.data._id, itemId: id };
        console.log("Deleting item:", dtoIn);
        const result = await FetchHelper().shoppingList.deleteItem(
          dtoIn,
          loggedInUser
        );
        console.log("Delete item result:", result);
        if (result.ok) {
          setDetailDataLoader((current) => {
            const itemIndex = current.data.itemList.findIndex(
              (item) => item.id === id
            );
            current.data.itemList.splice(itemIndex, 1);
            return JSON.parse(JSON.stringify(current));
          });
        } else {
          console.error("Error deleting item:", result.data);
        }
      },
      addMember: async ({ memberId }) => {
        const dtoIn = { listId: detailDataLoader.data._id, userId: memberId };
        console.log("Adding member:", dtoIn);
        const result = await FetchHelper().shoppingList.addMember(
          dtoIn,
          loggedInUser
        );
        console.log("Add member result:", result);
        if (result.ok) {
          setDetailDataLoader((current) => {
            if (!current.data.memberIdList.includes(memberId)) {
              current.data.memberIdList.push(memberId);
            }
            return JSON.parse(JSON.stringify(current));
          });
        } else {
          console.error("Error adding member:", result.data);
        }
      },
      removeMember: async ({ memberId }) => {
        const dtoIn = { listId: detailDataLoader.data._id, userId: memberId };
        console.log("Removing member:", dtoIn);
        const result = await FetchHelper().shoppingList.removeMember(
          dtoIn,
          loggedInUser
        );
        console.log("Remove member result:", result);
        if (result.ok) {
          setDetailDataLoader((current) => {
            const memberIndex = current.data.memberIdList.findIndex(
              (item) => item === memberId
            );
            current.data.memberIdList.splice(memberIndex, 1);
            return JSON.parse(JSON.stringify(current));
          });
        } else {
          console.error("Error removing member:", result.data);
        }
      },
      updateName: ({ name }) => {
        handleUpdate({
          id: detailDataLoader.data._id, // Ensure the id is passed
          listName: name,
        });
      },
    },
    showResolved,
    toggleShowResolved: () => setShowResolved((current) => !current),
  };

  return (
    <SLDetailContext.Provider value={value}>
      {children}
    </SLDetailContext.Provider>
  );
}

export default DetailProvider;
