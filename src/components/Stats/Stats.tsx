import OrderMembersByAreaChart from "../OrderMembersByAreaChart/OrderMembersByAreaChart";
import ChartCard from "../ChartCard/ChartCard";
import OrderMembersOverTimeChart from "../OrderMembersOverTimeChart/OrderMembersOverTimeChart";

export default function Stats() {
  return (
    <div className="bg-gray-100 h-full">
      <div className="p-5">
        <div className="xl:grid grid-cols-2 gap-5">
          <ChartCard title="Order Members Over Time">
            <OrderMembersOverTimeChart />
          </ChartCard>
          <ChartCard title="Current Order Members by Area">
            <OrderMembersByAreaChart />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
