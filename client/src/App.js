import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import SLDetail from "./SLDetail/SLDetail";
import UserProvider from "./Users/UserProvider";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <SLDetail />
      </UserProvider>
    </div>
  );
}

export default App;
