import Header from "./Header";
import Toolbar from "./Toolbar";
import SLItemList from "./SLItemList";
import SLDetailProvider from "./SLDetailProvider";
import Footer from "./Footer";

function SLDetail() {
  return (
    <div>
      <SLDetailProvider>
        <Header />
        <Toolbar />
        <SLItemList />
        <Footer />
      </SLDetailProvider>
    </div>
  );
}

export default SLDetail;
