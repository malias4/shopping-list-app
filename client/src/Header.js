import { useContext } from "react";
import { UserContext } from "./Users/UserProvider.js";
import { useNavigate } from "react-router-dom";
import "./Styles.css";
import Icon from "@mdi/react";
import { mdiBasketCheck } from "@mdi/js";

function Header() {
  const { userList, loggedInUser, setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="header">
      <button
        className="app-name"
        onClick={() => navigate("/")}
        style={{
          background: "none",
          border: "none",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <span>Shopping List App</span>
        <Icon
          path={mdiBasketCheck}
          size={1}
          className="icon"
          style={{ marginLeft: "10px" }}
        />
      </button>
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
