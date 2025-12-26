import { formatDate } from "./dates";
import {
  DataSource,
  OrderMember,
  OrderMemberEventOrdained,
  OrdinationLocation,
  TableRowData,
} from "./types";

export function orderMemberToTableRow(
  name: string,
  orderMember: OrderMember,
  orderMembers: Record<string, OrderMember>,
  source: DataSource
): TableRowData {
  const lastOrdainedEventIndex = orderMember.events.findLastIndex(
    (event) => event.type === "ordained"
  );
  const lastOrdainedEvent =
    lastOrdainedEventIndex === -1
      ? undefined
      : orderMember.events[lastOrdainedEventIndex];
  const lastOrdainedDate =
    lastOrdainedEvent && lastOrdainedEvent.date
      ? new Date(lastOrdainedEvent.date)
      : null;
  const leftOrderEvent = orderMember.events
    .slice(lastOrdainedEventIndex)
    .findLast((event) => ["died", "resigned", "removed"].includes(event.type));

  const orderMemberEvents = Object.values(orderMembers).flatMap(
    (om) => om.events
  );
  const disciplesPrivate = orderMemberEvents.filter(
    (event) =>
      event.type === "ordained" &&
      (event as OrderMemberEventOrdained).privatePreceptor === name
  ).length;
  const disciplesPublic = orderMemberEvents.filter(
    (event) =>
      event.type === "ordained" &&
      (event as OrderMemberEventOrdained).publicPreceptor === name
  ).length;

  return {
    key: name,
    link: "/order-members/" + name,
    title: orderMember.name,
    description: (
      <>
        {lastOrdainedDate ? formatDate(lastOrdainedDate) : "Unknown"}
        {leftOrderEvent && (
          <>
            &mdash;
            {leftOrderEvent && leftOrderEvent.date
              ? formatDate(new Date(leftOrderEvent.date))
              : "Unknown"}
          </>
        )}
      </>
    ),
    image: orderMember.image
      ? (process.env.PHOTOS_BASE_URL ?? "https://photos.triratna.directory") +
        "/" +
        orderMember.image
      : null,
    date: lastOrdainedDate,
    badge: orderMember.status === "Active" ? null : orderMember.status,
    bubble: [disciplesPrivate, disciplesPublic].filter((n) => n > 0),
    filterValues: {
      gender: [orderMember.gender],
      area: [orderMember.area],
      status: [orderMember.status],
      preceptors:
        disciplesPrivate && disciplesPublic
          ? ["private", "public"]
          : disciplesPrivate
          ? ["private"]
          : disciplesPublic
          ? ["public"]
          : [],
    },
  };
}

export function locationToTableRow(
  name: string,
  location: OrdinationLocation,
  orderMembers: Record<string, OrderMember>
): TableRowData {
  return {
    key: name,
    link: "/locations/" + name,
    title: location.name,
    description: locationDescription(location),
    image: null,
    date: null,
    badge: null,
    bubble: [
      Object.values(orderMembers)
        .flatMap((om) => om.events)
        .filter(
          (event) =>
            event.type === "ordained" &&
            (event as OrderMemberEventOrdained).location === name
        ).length,
    ],
    filterValues: {},
  };
}

function locationDescription(location: OrdinationLocation) {
  switch (location.type) {
    case "community":
      return <>Community in {location.country}</>;
    case "retreat_centre":
      return <>Retreat Centre in {location.country}</>;
    case "buddhist_centre":
      return <>Buddhist Centre in {location.country}</>;
    case "town_or_city":
      return <>Place in {location.country}</>;
    case "unknown":
      return location.country ? <>Place in {location.country}</> : <></>;
  }
  return <></>;
}
