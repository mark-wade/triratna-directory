import { useContext } from "react";
import { orderMemberToTableRow } from "../../utilities/tableConverters";
import {
  DataSource,
  OrderMember,
  OrderMemberEventOrdained,
} from "../../utilities/types";
import { DataContext } from "../DataContext/DataContext";
import { Header } from "../Header/Header";
import EagerLoadingTable from "../EagerLoadingTable/EagerLoadingTable";
import Feedback from "../Feedback/Feedback";

export default function LocationProfile({ name }: { name: string }) {
  const { source, orderMembers, locations } = useContext(DataContext);
  const location = locations[name];
  return (
    <>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Header title={location.name} />
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-5">
          <EagerLoadingTable
            data={getOrderMembersOrdainedInLocation(name, orderMembers, source)}
          />
        </div>
        <div className="text-center my-4">
          <Feedback
            className="text-gray-400 text-xs cursor-pointer"
            defaultType="data"
            defaultData="location"
            defaultDataValue={name}
          />
        </div>
      </div>
    </>
  );
}

function getOrderMembersOrdainedInLocation(
  name: string,
  orderMembers: Record<string, OrderMember>,
  source: DataSource
) {
  return Object.entries(orderMembers)
    .flatMap(([id, om]) =>
      om.events.map((event) => {
        return { event, om, id };
      })
    )
    .filter(
      ({ event }) =>
        event.type === "ordained" &&
        (event as OrderMemberEventOrdained).location === name
    )
    .sort(({ event: a }, { event: b }) => {
      if (!a.date) {
        return 1;
      }
      if (!b.date) {
        return -1;
      }
      return new Date(a.date).valueOf() - new Date(b.date).valueOf();
    })
    .map(({ om, id }) => orderMemberToTableRow(id, om, orderMembers, source));
}
