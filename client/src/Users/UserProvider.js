import { createContext, useState } from "react";

export const UserContext = createContext();

function UserProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState("60d5ec49f1b2c12d4c8e4b5n"); // Default user ID
  const userMap = {
    u1: {
      id: "60d5ec49f1b2c12d4c8e4b5n",
      name: "user1",
    },
    u2: {
      id: "674b5d2c78cc2276f48b538d",
      name: "user2",
    },
    u3: {
      id: "60d5ec49f1b2c12d4c8e4b1c",
      name: "user3",
    },
    u4: {
      id: "60d5ec49f1b2c12d4c8e4b1d",
      name: "user4",
    },
  };

  const value = {
    userMap,
    userList: Object.keys(userMap).map((userId) => userMap[userId]),
    loggedInUser,
    setLoggedInUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
