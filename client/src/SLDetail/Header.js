import { useContext } from "react";
import { UserContext } from "../Users/UserProvider.js";
import "../Styles.css";
import Icon from "@mdi/react";
import { mdiBasketCheck } from "@mdi/js";

function Header() {
  const { userList, loggedInUser, setLoggedInUser } = useContext(UserContext);
  return (
    <div className="header">
      <div className="app-name">
        <span>Shopping List App</span>
        <Icon
          path={mdiBasketCheck}
          size={1}
          className="icon"
          style={{ marginLeft: "10px" }}
        />
      </div>
      <div className="user-buttons">
        {userList.map((user) => (
          <button key={user.id} onClick={() => setLoggedInUser(user.id)}>
            {user.name} {(user.id === loggedInUser).toString()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Header;
