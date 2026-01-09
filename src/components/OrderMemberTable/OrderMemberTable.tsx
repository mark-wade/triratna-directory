import { useParams, useSearchParams } from "react-router";
import Profile from "../Profile/Profile";
import { useContext } from "react";
import { AREAS, SortBy, TableRowData } from "../../utilities/types";
import { DataContext } from "../DataContext/DataContext";
import PageNotFound from "../PageNotFound/PageNotFound";
import MasterDetailTable from "../MasterDetailTable/MasterDetailTable";
import NavWrapper from "../NavWrapper/NavWrapper";
import { dateStringToDate } from "../../utilities/dates";

export default function OrderMemberTable() {
  const { source, orderMembers, orderMemberRows } = useContext(DataContext);
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();

  const inYear = searchParams.has("in")
    ? parseInt(searchParams.get("in") as string)
    : undefined;
  if (inYear !== undefined) {
    if (isNaN(inYear) || inYear < 1968 || inYear > new Date().getFullYear()) {
      return <PageNotFound />;
    }
  }

  const element = name ? (
    orderMembers.hasOwnProperty(name) ? (
      <Profile name={name} />
    ) : (
      <PageNotFound />
    )
  ) : null;

  function updateOrderMemberRowsForYear(
    orderMemberRows: TableRowData[],
    year: number
  ) {
    return orderMemberRows
      .filter((row) => row.date && row.date.getFullYear() <= year)
      .map((row) => {
        row.filterValues.status = ["Active"];

        const diedEvent = orderMembers[row.key].events.find(
          (event) => event.type === "died"
        );
        const resignedEvent = orderMembers[row.key].events.find(
          (event) => event.type === "resigned"
        );
        const removedEvent = orderMembers[row.key].events.find(
          (event) => event.type === "removed"
        );
        if (
          diedEvent &&
          diedEvent.date &&
          dateStringToDate(diedEvent.date).getFullYear() <= year
        ) {
          row.filterValues.status = ["Deceased"];
        } else if (
          resignedEvent &&
          resignedEvent.date &&
          dateStringToDate(resignedEvent.date).getFullYear() <= year
        ) {
          row.filterValues.status = ["Resigned"];
        } else if (
          removedEvent &&
          removedEvent.date &&
          dateStringToDate(removedEvent.date).getFullYear() <= year
        ) {
          row.filterValues.status = ["Removed"];
        }
        return row;
      });
  }

  const filters = [
    {
      key: "status",
      name: "Status",
      type: "multi" as "multi",
      defaultValue: ["Active", "Deceased", "Resigned", "Removed"],
      options: [
        {
          value: "Active",
          name: inYear ? `Active in ${inYear}` : "Active",
        },
        {
          value: "Deceased",
          name: inYear ? `Deceased in or before ${inYear}` : "Deceased",
        },
        {
          value: "Resigned",
          name: inYear ? `Resigned in or before ${inYear}` : "Resigned",
        },
        {
          value: "Removed",
          name: inYear ? `Removed in or before ${inYear}` : "Removed",
        },
      ],
      forceShowActive: inYear ? true : false,
    },
    {
      key: "gender",
      name: "Gender",
      type: "single" as "single",
      defaultValue: "", //["Male", "Female", "NonBinary"],
      options: [
        {
          value: "",
          name: "Show All",
        },
        {
          value: "Male",
          name: "Dharmacharis",
        },
        {
          value: "Female",
          name: "Dharmacharinis",
        },
        // {
        //   value: "NonBinary",
        //   name: "Non-Binary",
        // },
      ],
    },
  ];
  if (source === "maitrijala") {
    filters.push({
      key: "area",
      name: "Area",
      type: "single" as "single",
      defaultValue: "",
      options: [
        {
          value: "",
          name: "Show All",
        },
        ...Object.entries(AREAS).map(([k, v]) => {
          return {
            value: k,
            name: v.name,
          };
        }),
      ],
    });
  }
  filters.push({
    key: "preceptors",
    name: "Preceptors",
    type: "single" as "single",
    defaultValue: "",
    options: [
      {
        value: "",
        name: "Show All",
      },
      {
        value: "private",
        name: "Private Preceptors",
      },
      {
        value: "public",
        name: "Public Preceptors",
      },
    ],
  });

  return (
    <NavWrapper
      title={name ? orderMembers[name].name : undefined}
      className="bg-gray-100"
    >
      <MasterDetailTable
        active={name}
        key="order-members"
        data={
          inYear
            ? updateOrderMemberRowsForYear(orderMemberRows, inYear)
            : orderMemberRows
        }
        element={element}
        sortOptions={[
          {
            by: SortBy.ALPHABETICAL,
            title: "Name",
          },
          {
            by: SortBy.OLDEST,
            title: "Date Ordained (oldest first)",
          },
          {
            by: SortBy.NEWEST,
            title: "Date Ordained (newest first)",
          },
          {
            by: SortBy.BUBBLE,
            title: "Most Disciples",
          },
        ]}
        defaultSort={SortBy.ALPHABETICAL}
        filters={filters}
      />
    </NavWrapper>
  );
}
