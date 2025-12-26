import { Link, useNavigate, useParams } from "react-router";
import { useContext, useEffect } from "react";
import { DataContext } from "../DataContext/DataContext";
import {
  OrderMember,
  OrderMemberEvent,
  OrderMemberEventOrdained,
  OrderMemberEventType,
} from "../../utilities/types";
import PageNotFound from "../PageNotFound/PageNotFound";
import "./TimeMachine.css";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../../utilities/dates";
import OrderMemberGrid from "../OrderMemberGrid/OrderMemberGrid";
import StatsBox from "../StatsBox/StatsBox";

export default function TimeMachine() {
  const navigate = useNavigate();
  const { yearAsString } = useParams<{ yearAsString: string }>();
  const { orderMembers } = useContext(DataContext);
  const year = parseInt(
    yearAsString ? yearAsString : `${new Date().getFullYear()}`
  );

  useEffect(() => {
    function handleKeypress(e: KeyboardEvent): void {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        e.preventDefault();
        const direction = e.code === "ArrowRight" ? 1 : -1;
        const newYear = year + direction;
        if (newYear >= 1968 && newYear <= new Date().getFullYear()) {
          navigate("/history/" + newYear);
        }
      }
    }
    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener("keydown", handleKeypress);
  }, [navigate, year]);

  if (isNaN(year) || year < 1968 || year > new Date().getFullYear()) {
    return <PageNotFound />;
  }

  function getEvents(eventTypes: OrderMemberEventType[]) {
    return Object.entries(orderMembers)
      .flatMap(([id, om]) =>
        om.events.map((event) => {
          return { event, om, id };
        })
      )
      .filter(
        ({ event }) =>
          eventTypes.includes(event.type) &&
          event.date &&
          new Date(event.date).getFullYear() === year
      )
      .sort(({ om: a }, { om: b }) => a.name.localeCompare(b.name))
      .sort(({ event: a }, { event: b }) => {
        if (!a.date) {
          return 1;
        }
        if (!b.date) {
          return -1;
        }
        return new Date(a.date).valueOf() - new Date(b.date).valueOf();
      });
  }

  function getOms() {
    const groupedOms: Record<
      string,
      Record<string, { event: OrderMemberEvent; om: OrderMember; id: string }[]>
    > = {};

    const filteredOmsAndEvents = getEvents(["ordained"]).filter(
      ({ om }) => om.name !== "Sangharakshita"
    );

    for (const { event, om, id } of filteredOmsAndEvents) {
      if (event.date) {
        if (!groupedOms[event.date]) {
          groupedOms[event.date] = {};
        }
        if (
          !groupedOms[event.date][(event as OrderMemberEventOrdained).location]
        ) {
          groupedOms[event.date][(event as OrderMemberEventOrdained).location] =
            [];
        }
        groupedOms[event.date][
          (event as OrderMemberEventOrdained).location
        ].push({ event, om, id });
      }
    }

    return {
      groupedOms,
      count: filteredOmsAndEvents.length,
    };
  }

  const omsOrdainedThisYear = getOms();
  const omsDiedThisYear = getEvents(["died"]);
  const omsLeftThisYear = getEvents(["resigned", "removed"]);

  const totals = Object.entries(orderMembers).reduce(
    (accumulator, [, om]) => {
      let hadBeenActive = false;
      let wasActive = false;
      let wasFormer = false;
      let wasDeceased = false;
      for (const event of om.events) {
        if (event.date && new Date(event.date).getFullYear() <= year) {
          switch (event.type) {
            case "ordained":
              hadBeenActive = true;
              wasActive = true;
              break;
            case "died":
              wasActive = false;
              wasDeceased = true;
              break;
            case "resigned":
            case "removed":
              wasActive = false;
              wasFormer = true;
              break;
          }
        }
      }
      if (hadBeenActive) {
        accumulator.total++;
      }
      if (wasActive) {
        accumulator.active++;
      }
      if (wasFormer) {
        accumulator.resigned++;
      }
      if (wasDeceased) {
        accumulator.deceased++;
      }
      return accumulator;
    },
    { total: 0, active: 0, deceased: 0, resigned: 0 }
  );

  const activeChange =
    omsOrdainedThisYear.count - omsDiedThisYear.length - omsLeftThisYear.length;

  return (
    <div className="bg-gray-100 min-h-full">
      <div className="py-12 sm:py-18 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="text-center pb-6">
              <div className="flex justify-center items-center text-5xl font-semibold tracking-tight text-balance text-gray-900">
                {year === 1968 ? (
                  <div className="size-8 mr-8 text-gray-600">
                    <ArrowLeftIcon />
                  </div>
                ) : (
                  <div className="size-8 mr-8 text-indigo-600">
                    <Link to={"/history/" + (year - 1)}>
                      <ArrowLeftIcon />
                    </Link>
                  </div>
                )}
                <h2>{year}</h2>
                {year === new Date().getFullYear() ? (
                  <div className="size-8 ml-8 text-gray-600">
                    <ArrowRightIcon />
                  </div>
                ) : (
                  <div className="size-8 ml-8 text-indigo-600">
                    <Link to={"/history/" + (year + 1)}>
                      <ArrowRightIcon />
                    </Link>
                  </div>
                )}
              </div>
              <div className="mx-auto max-w-xl mt-6">
                <input
                  className="w-full slider"
                  type="range"
                  min={1968}
                  max={new Date().getFullYear()}
                  step={1}
                  onChange={(e) => {
                    navigate(`/history/${e.target.value}`);
                  }}
                  value={year}
                />
              </div>
            </div>
            <StatsBox
              stats={[
                {
                  label: "Total",
                  value: totals.total,
                  valueChange: omsOrdainedThisYear.count,
                  valueChangeClassName: "text-indigo-600",
                  link: `/order-members/?in=${year}`,
                },
                {
                  label: "Active",
                  value: totals.active,
                  valueChange: activeChange,
                  valueChangeClassName: "text-green-600",
                  link: `/order-members/?in=${year}&status=Active`,
                },
                {
                  label: "Deceased",
                  value: totals.deceased,
                  valueChange: omsDiedThisYear.length,
                  valueChangeClassName: "text-gray-500",
                  link: `/order-members/?in=${year}&status=Deceased`,
                },
                {
                  label: "Former",
                  value: totals.resigned,
                  valueChange: omsLeftThisYear.length,
                  valueChangeClassName: "text-rose-600",
                  link: `/order-members/?in=${year}&status=Resigned`,
                },
              ]}
            />
          </div>
        </div>
      </div>
      {omsOrdainedThisYear.count > 0 && (
        <div className="py-5 sm:px-5">
          <h3 className="px-5 sm:px-0 text-3xl font-semibold text-gray-900 mb-5">
            {omsOrdainedThisYear.count.toLocaleString()}{" "}
            {omsOrdainedThisYear.count === 1 ? "person" : "people"} joined the
            order
          </h3>
          <div className="overflow-hidden sm:rounded-lg bg-white shadow-sm mb-5">
            <div className="bg-white px-4 py-5 sm:px-6">
              {Object.entries(omsOrdainedThisYear.groupedOms).map(
                ([date, locations]) => (
                  <div key={"ordained-" + date}>
                    {Object.entries(locations).map(([location, oms]) => (
                      <div key={"ordained-" + date + "-" + location}>
                        <h3 className="text-base font-semibold text-gray-900">
                          {formatDate(new Date(date), false)} at{" "}
                          {location ? (
                            <Link to={"/locations/" + location} viewTransition>
                              {location}
                            </Link>
                          ) : (
                            <>an unknown location</>
                          )}
                        </h3>
                        <OrderMemberGrid oms={oms} />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      {omsDiedThisYear.length > 0 && (
        <div className="py-5 sm:px-5" id="deaths">
          <h3 className="px-5 sm:px-0 text-3xl font-semibold text-gray-900 mb-5">
            {omsDiedThisYear.length.toLocaleString()} order member
            {omsDiedThisYear.length === 1 ? "" : "s"} died
          </h3>
          <div className="overflow-hidden sm:rounded-lg bg-white shadow-sm mb-5">
            <div className="bg-white px-4 py-5 sm:px-6">
              <OrderMemberGrid oms={omsDiedThisYear} />
            </div>
          </div>
        </div>
      )}
      {omsLeftThisYear.length > 0 && (
        <div className="py-5 sm:px-5">
          <h3 className="px-5 sm:px-0 text-3xl font-semibold text-gray-900 mb-5">
            {omsLeftThisYear.length.toLocaleString()}{" "}
            {omsLeftThisYear.length === 1 ? "person" : "people"} left the order
          </h3>
          <div className="overflow-hidden rounded-lg bg-white shadow-sm mb-5">
            <div className="bg-white px-4 py-5 sm:px-6">
              <OrderMemberGrid oms={omsLeftThisYear} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
