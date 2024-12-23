import Toolbar from "./Toolbar";
import ItemList from "./SLItemList";
import DetailProvider from "./SLDetailProvider";
import Footer from "./Footer";
import ItemChart from "./SLItemChart";

function Detail() {
  return (
    <div>
      <DetailProvider>
        <Toolbar />
        <ItemList />
        <ItemChart />
        <Footer />
      </DetailProvider>
    </div>
  );
}

export default Detail;
