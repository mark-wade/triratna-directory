import { useContext, useState, useEffect } from "react";
import {
  yearsAndMonthsBetweenDates,
  formatDate,
  dateStringToDate,
} from "../../utilities/dates";
import { orderMemberToTableRow } from "../../utilities/tableConverters";
import {
  AREAS,
  OrderMember,
  OrderMemberEventOrdained,
} from "../../utilities/types";
import { DataContext } from "../DataContext/DataContext";
import EagerLoadingTable from "../EagerLoadingTable/EagerLoadingTable";
import { Header } from "../Header/Header";
import { InformationTable } from "../InformationTable/InformationTable";
import { InformationTableRow } from "../InformationTableRow/InformationTableRow";
import { Link, useLocation } from "react-router";
import Feedback from "../Feedback/Feedback";
import Feed from "../Feed/Feed";
import {
  CheckIcon,
  HandRaisedIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { ProfileContactDetails } from "../ProfileContactDetails/ProfileContactDetails";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { DialogTitle } from "@headlessui/react";

export default function Profile({ name }: { name: string }) {
  const { source, authenticatedUser, orderMembers, locations } = useContext(DataContext);
  const om = orderMembers[name];
  const [todaysDate, setTodaysDate] = useState<Date>();
  const location = useLocation();
  const previousNavs = location.state ?? [];

  useEffect(() => {
    // Using the current date makes the function impure, so it needs to go in an effect
    setTodaysDate(new Date());
  }, []);

  function getDisciples(
    preceptorName: string,
    type: "privatePreceptor" | "publicPreceptor"
  ) {
    return Object.entries(orderMembers)
      .filter(
        ([, om]) =>
          om.events.find(
            (event) =>
              event.type === "ordained" &&
              (event as OrderMemberEventOrdained)[type] === preceptorName
          ) !== undefined
      )
      .sort(([, a], [, b]) => {
        if (!a.events.length || !a.events[0].date) {
          return 1;
        }
        if (!b.events.length || !b.events[0].date) {
          return -1;
        }
        return (
          new Date(a.events[0].date).valueOf() -
          new Date(b.events[0].date).valueOf()
        );
      })
      .map(([k, v]) => orderMemberToTableRow(k, v, orderMembers, source));
  }
  const privatePreceptorTo = getDisciples(name, "privatePreceptor");
  const publicPreceptorTo = getDisciples(name, "publicPreceptor");

  function ProfileDetailsSimple({ om }: { om: OrderMember }) {
    const ordainedEvent = om.events.find((event) => {
      return event.type === "ordained";
    }) as OrderMemberEventOrdained | undefined;
    const ordainedDate =
      ordainedEvent && ordainedEvent.date
        ? dateStringToDate(ordainedEvent.date)
        : undefined;

    const diedEvent = om.events.find((event) => {
      return event.type === "died";
    });
    const diedDate =
      diedEvent && diedEvent.date
        ? dateStringToDate(diedEvent.date)
        : undefined;
    const resignedEvent = om.events.find((event) => {
      return event.type === "resigned";
    });
    const resignedDate =
      resignedEvent && resignedEvent.date
        ? dateStringToDate(resignedEvent.date)
        : undefined;
    const removedEvent = om.events.find((event) => {
      return event.type === "removed";
    });
    const removedDate =
      removedEvent && removedEvent.date
        ? dateStringToDate(removedEvent.date)
        : undefined;
    function getEndDate() {
      if (resignedEvent) {
        return resignedDate;
      }
      if (removedEvent) {
        return removedDate;
      }
      if (diedEvent) {
        return diedDate;
      }
      return todaysDate;
    }
    const endDate = getEndDate();

    const ordainedTimeText = ordainedDate
      ? endDate
        ? yearsAndMonthsBetweenDates(ordainedDate, endDate)
        : null
      : null;

    return (
      <InformationTable>
        <InformationTableRow
          label={
            om.name === "Sangharakshita" ? "Founded the Order" : "Date Ordained"
          }
        >
          {ordainedDate ? (
            <Link
              to={"/history/" + ordainedDate.getFullYear()}
              viewTransition
              state={[...previousNavs, om.name]}
            >
              {formatDate(ordainedDate)}
              {om.status === "Active" && <> ({ordainedTimeText} ago)</>}
            </Link>
          ) : (
            <>Unknown</>
          )}
        </InformationTableRow>
        {resignedEvent && (
          <InformationTableRow label="Date Resigned">
            {resignedDate ? (
              <Link
                to={"/history/" + resignedDate.getFullYear()}
                viewTransition
                state={[...previousNavs, om.name]}
              >
                {formatDate(resignedDate)} (order age {ordainedTimeText})
              </Link>
            ) : (
              <>Unknown</>
            )}
          </InformationTableRow>
        )}
        {removedEvent && (
          <InformationTableRow label="Date Removed">
            {removedDate ? (
              <Link
                to={"/history/" + removedDate.getFullYear()}
                viewTransition
                state={[...previousNavs, om.name]}
              >
                {formatDate(removedDate)} (order age {ordainedTimeText})
              </Link>
            ) : (
              <>Unknown</>
            )}
          </InformationTableRow>
        )}
        {diedEvent && (
          <InformationTableRow label="Date Died">
            {diedDate ? (
              <Link
                to={"/history/" + diedDate.getFullYear()}
                viewTransition
                state={[...previousNavs, om.name]}
              >
                {formatDate(diedDate)}
                {om.status === "Deceased" && (
                  <> (order age {ordainedTimeText})</>
                )}
              </Link>
            ) : (
              <>Unknown</>
            )}
          </InformationTableRow>
        )}
        <InformationTableRow label="Area">
          {om.area && AREAS[om.area] ? (
            <Link
              className="text-indigo-600"
              to={"/order-members/?area=" + encodeURIComponent(om.area)}
              viewTransition
              state={[...previousNavs, om.name]}
            >
              {AREAS[om.area].name}
            </Link>
          ) : (
            <>Unknown</>
          )}
        </InformationTableRow>
        {om.name !== "Sangharakshita" && (
          <InformationTableRow
            label={
              ordainedEvent &&
              (!ordainedEvent.privatePreceptor ||
                ordainedEvent.privatePreceptor !==
                  ordainedEvent.publicPreceptor)
                ? "Private Preceptor"
                : "Preceptor"
            }
          >
            {ordainedEvent?.privatePreceptor &&
            orderMembers[ordainedEvent.privatePreceptor] ? (
              <Link
                className="text-indigo-600"
                to={"/order-members/" + ordainedEvent.privatePreceptor}
                viewTransition
                state={[...previousNavs, om.name]}
              >
                {orderMembers[ordainedEvent.privatePreceptor].name}
              </Link>
            ) : (
              <>
                {ordainedEvent?.privatePreceptor
                  ? ordainedEvent?.privatePreceptor
                  : "Unknown"}
              </>
            )}
          </InformationTableRow>
        )}
        {ordainedEvent &&
          (!ordainedEvent.publicPreceptor ||
            ordainedEvent.privatePreceptor !==
              ordainedEvent.publicPreceptor) && (
            <InformationTableRow label="Public Preceptor">
              {orderMembers[ordainedEvent.publicPreceptor] ? (
                <Link
                  className="text-indigo-600"
                  to={"/order-members/" + ordainedEvent.publicPreceptor}
                  viewTransition
                  state={[...previousNavs, om.name]}
                >
                  {orderMembers[ordainedEvent.publicPreceptor].name}
                </Link>
              ) : (
                <>
                  {ordainedEvent.publicPreceptor
                    ? ordainedEvent.publicPreceptor
                    : "Unknown"}
                </>
              )}
            </InformationTableRow>
          )}
        {om.name !== "Sangharakshita" && (
          <InformationTableRow label="Place Ordained">
            {ordainedEvent?.location ? (
              <Link
                className="text-indigo-600"
                to={"/locations/" + ordainedEvent.location}
                viewTransition
                state={[...previousNavs, om.name]}
              >
                {locations[ordainedEvent.location].name},{" "}
                {locations[ordainedEvent.location].country}
              </Link>
            ) : (
              <>Unknown</>
            )}
          </InformationTableRow>
        )}
      </InformationTable>
    );
  }

  function ProfileDetailsComplex({ om }: { om: OrderMember }) {
    function formatTimelineDate(
      maybeDate: string | undefined,
      timeAgo: Date | undefined = undefined,
      orderAgeFrom: Date | undefined = undefined
    ) {
      if (!maybeDate) {
        return <>Unknown Date</>;
      }

      const date = dateStringToDate(maybeDate);

      return (
        <Link
          to={"/history/" + date.getFullYear()}
          viewTransition
          state={[...previousNavs, om.name]}
        >
          {formatDate(date)}
          {timeAgo && <> ({yearsAndMonthsBetweenDates(date, timeAgo)} ago)</>}
          {orderAgeFrom && (
            <> (order age {yearsAndMonthsBetweenDates(orderAgeFrom, date)})</>
          )}
        </Link>
      );
    }

    return (
      <InformationTable>
        <InformationTableRow label="Timeline">
          <div className="flow-root">
            <Feed
              timeline={om.events
                .filter((event) =>
                  ["ordained", "died", "resigned", "removed"].includes(
                    event.type
                  )
                )
                .map((event, eventIdx) => {
                  const lastOrdained = om.events
                    .slice(0, eventIdx)
                    .findLast(
                      (e) => e.type === "ordained" || e.type === "reinstated"
                    );
                  switch (event.type) {
                    case "ordained":
                      const ordainedEvent = event as OrderMemberEventOrdained;
                      return {
                        iconBackground: "bg-green-500",
                        icon: PlusIcon,
                        title: formatTimelineDate(
                          event.date,
                          om.status === "Active" ? new Date() : undefined
                        ),
                        description: (
                          <>
                            Ordained
                            <>
                              {" "}
                              {ordainedEvent.privatePreceptor ===
                              ordainedEvent.publicPreceptor ? (
                                <>
                                  by{" "}
                                  <Link
                                    className="text-indigo-600"
                                    to={
                                      "/order-members/" +
                                      ordainedEvent.privatePreceptor
                                    }
                                    viewTransition
                                    state={[...previousNavs, om.name]}
                                  >
                                    {ordainedEvent.privatePreceptor}
                                  </Link>
                                </>
                              ) : ordainedEvent.privatePreceptor ? (
                                <>
                                  privately by{" "}
                                  <Link
                                    className="text-indigo-600"
                                    to={
                                      "/order-members/" +
                                      ordainedEvent.privatePreceptor
                                    }
                                    viewTransition
                                    state={[...previousNavs, om.name]}
                                  >
                                    {ordainedEvent.privatePreceptor}
                                  </Link>{" "}
                                  and publicly by{" "}
                                  <Link
                                    className="text-indigo-600"
                                    to={
                                      "/order-members/" +
                                      ordainedEvent.publicPreceptor
                                    }
                                    viewTransition
                                    state={[...previousNavs, om.name]}
                                  >
                                    {ordainedEvent.publicPreceptor}
                                  </Link>{" "}
                                </>
                              ) : (
                                <>
                                  publicly by{" "}
                                  <Link
                                    className="text-indigo-600"
                                    to={
                                      "/order-members/" +
                                      ordainedEvent.publicPreceptor
                                    }
                                    viewTransition
                                    state={[...previousNavs, om.name]}
                                  >
                                    {ordainedEvent.publicPreceptor}
                                  </Link>{" "}
                                </>
                              )}
                            </>
                            <>
                              {ordainedEvent.location ? (
                                <>
                                  {" "}
                                  at{" "}
                                  <Link
                                    className="text-indigo-600"
                                    to={"/locations/" + ordainedEvent.location}
                                    viewTransition
                                    state={[...previousNavs, om.name]}
                                  >
                                    {locations[ordainedEvent.location].name},{" "}
                                    {locations[ordainedEvent.location].country}
                                  </Link>
                                </>
                              ) : (
                                <>, location unknown</>
                              )}
                            </>
                          </>
                        ),
                      };
                    case "died":
                      return {
                        iconBackground: "bg-gray-600",
                        icon: MinusIcon,
                        title: formatTimelineDate(
                          event.date,
                          undefined,
                          lastOrdained && lastOrdained.date
                            ? dateStringToDate(lastOrdained.date)
                            : undefined
                        ),
                        description: "Died",
                      };
                    case "resigned":
                      return {
                        iconBackground: "bg-gray-400",
                        icon: MinusIcon,
                        title: formatTimelineDate(
                          event.date,
                          undefined,
                          lastOrdained && lastOrdained.date
                            ? dateStringToDate(lastOrdained.date)
                            : undefined
                        ),
                        description: "Resigned",
                      };
                    case "removed":
                      return {
                        iconBackground: "bg-gray-400",
                        icon: MinusIcon,
                        title: formatTimelineDate(
                          event.date,
                          undefined,
                          lastOrdained && lastOrdained.date
                            ? dateStringToDate(lastOrdained.date)
                            : undefined
                        ),
                        description: "Removed",
                      };
                    case "suspended":
                      return {
                        iconBackground: "bg-yellow-500",
                        icon: HandRaisedIcon,
                        title: formatTimelineDate(
                          event.date,
                          undefined,
                          lastOrdained && lastOrdained.date
                            ? dateStringToDate(lastOrdained.date)
                            : undefined
                        ),
                        description: "Suspended",
                      };
                    case "reinstated":
                      return {
                        iconBackground: "bg-green-500",
                        icon: CheckIcon,
                        title: formatTimelineDate(
                          event.date,
                          om.status === "Active" ? new Date() : undefined
                        ),
                        description: "Reinstated",
                      };
                  }
                })}
            />
          </div>
        </InformationTableRow>
        <InformationTableRow label="Area">
          {AREAS[om.area] ? (
            <Link
              className="text-indigo-600"
              to={"/order-members/?area=" + encodeURIComponent(om.area)}
              viewTransition
              state={[...previousNavs, om.name]}
            >
              {AREAS[om.area].name}
            </Link>
          ) : (
            <>Unknown</>
          )}
        </InformationTableRow>
      </InformationTable>
    );
  }

  const [updateDetailsOpen, setUpdateDetailsOpen] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Header
          title={om.name}
          subtitle={om.pronouns}
          image={
            om.image
              ? (process.env.PHOTOS_BASE_URL ??
                  "https://triratna-directory-order-photos.s3.eu-west-2.amazonaws.com") +
                "/" +
                om.image
              : undefined
          }
          imageFallback="No photo on file."
        >
          {om.meaning ? (
            <p className="sm:text-xl font-medium text-gray-600">
              <em>&ldquo;{om.meaning}&rdquo;</em>
            </p>
          ) : (
            <p className="text-sm text-grey-300">
              <em>(meaning of name not known)</em>
            </p>
          )}
          {(authenticatedUser === om.contact?.personalEmail || authenticatedUser === om.contact?.workEmail) && (
            <>
              <Button buttonStyle="primary" className="mt-4 px-3 py-2 cursor-pointer" onClick={() => setUpdateDetailsOpen(true)}>Update Profile</Button>
              <Modal open={updateDetailsOpen} setOpen={setUpdateDetailsOpen}>
                <div className="mb-4">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900 dark:text-white">
                    Email, phone number, or address
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 pb-2">
                      To update your contact details, or to opt out of having your contact details displayed on the directory, visit <a href="https://thebuddhistcentre.com/user" target="_blank" className="text-indigo-600">my order info</a>.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      After you have updated your details, it will take several hours for the changes to be reflected in the directory.
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900 dark:text-white">
                    Photo
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 pb-2">
                      To update your photo, email a high-resolution, uncropped colour photo to <a href={"mailto:shabda@triratnaorder.org?subject=" + encodeURIComponent(om.name + "+P")} className="text-indigo-600">shabda@triratnaorder.org</a> with your name in the subject line followed by +P. Ideally, your photo should have a pale background.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      After you have updated your photo, it will take several weeks for it to be updated in the directory.
                    </p>
                  </div>
                </div>
                <div className="">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900 dark:text-white">
                    Other
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 pb-2">
                      If there are any mistakes in your other details, <Feedback className="text-indigo-600 cursor-pointer" defaultType="data" defaultData="om" defaultDataValue={name}>let us know</Feedback>.
                    </p>
                  </div>
                </div>
              </Modal>
            </>
          )}
        </Header>
        {om.status === "Active" && (
          <ProfileContactDetails om={om} />
        )}
        {om.events.filter((event) => event.type === "ordained").length === 1 ? (
          <ProfileDetailsSimple om={om} />
        ) : (
          <ProfileDetailsComplex om={om} />
        )}
        <div
          className={
            Object.keys(privatePreceptorTo).length > 0 &&
            Object.keys(publicPreceptorTo).length > 0
              ? "xl:grid grid-cols-2 gap-5"
              : ""
          }
        >
          {Object.keys(privatePreceptorTo).length > 0 && (
            <div className="overflow-hidden">
              <div className="bg-white shadow-sm sm:rounded-lg my-5">
                <div className="px-4 py-4">
                  Private Preceptor to {Object.keys(privatePreceptorTo).length}{" "}
                  Order Member
                  {Object.keys(privatePreceptorTo).length === 1 ? "" : "s"}
                </div>
                <EagerLoadingTable
                  data={privatePreceptorTo}
                  navTitle={om.name}
                />
              </div>
            </div>
          )}
          {Object.keys(publicPreceptorTo).length > 0 && (
            <div className="overflow-hidden">
              <div className="bg-white shadow-sm sm:rounded-lg my-5">
                <div className="px-4 py-4">
                  Public Preceptor to {Object.keys(publicPreceptorTo).length}{" "}
                  Order Member
                  {Object.keys(publicPreceptorTo).length === 1 ? "" : "s"}
                </div>
                <EagerLoadingTable
                  data={publicPreceptorTo}
                  queryString={""}
                  navTitle={om.name}
                />
              </div>
            </div>
          )}
        </div>
        <div className="text-center my-4">
          <Feedback
            className="text-gray-400 text-xs cursor-pointer"
            defaultType="data"
            defaultData="om"
            defaultDataValue={name}
          />
        </div>
      </div>
    </>
  );
}
