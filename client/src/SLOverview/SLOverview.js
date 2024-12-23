import OverviewProvider from "./SLOverviewProvider";
import Toolbar from "./Toolbar";
import OverviewList from "./SLOverviewList";

function Overview() {
  return (
    <div>
      <OverviewProvider>
        <Toolbar />
        <OverviewList />
      </OverviewProvider>
    </div>
  );
}

export default Overview;
