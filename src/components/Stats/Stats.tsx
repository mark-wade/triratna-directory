import OrderMembersByAreaChart from "../OrderMembersByAreaChart/OrderMembersByAreaChart";
import ChartCard from "../ChartCard/ChartCard";
import OrderMembersOverTimeChart from "../OrderMembersOverTimeChart/OrderMembersOverTimeChart";
import SadhanaChart from "../SadhanaChart/SadhanaChart";

export default function Stats() {
  return (
    <div className="p-5">
      <div className="xl:grid grid-cols-2 gap-5">
        <ChartCard title="Order Members Over Time">
          <OrderMembersOverTimeChart />
        </ChartCard>
        <ChartCard title="Current Order Members by Area">
          <OrderMembersByAreaChart />
        </ChartCard>
        <ChartCard title="Most Given Sadhanas at Ordination">
          <SadhanaChart />
        </ChartCard>
      </div>
    </div>
  );
}
