import { useParams } from "react-router";
import { useContext } from "react";
import { TableRowData, SortBy } from "../../utilities/types";
import { DataContext } from "../DataContext/DataContext";
import LocationProfile from "../LocationProfile/LocationProfile";
import PageNotFound from "../PageNotFound/PageNotFound";
import MasterDetailTable from "../MasterDetailTable/MasterDetailTable";

export default function LocationTable() {
  const { locations, locationRows } = useContext(DataContext);
  const { name } = useParams<{ name: string }>();
  const element = name ? (
    locations.hasOwnProperty(name) ? (
      <LocationProfile name={name} />
    ) : (
      <PageNotFound />
    )
  ) : null;
  return (
    <MasterDetailTable
      key="locations"
      data={locationRows}
      element={element}
      sortOptions={[
        {
          by: SortBy.ALPHABETICAL,
          title: "Alphabetically",
        },
      ]}
      defaultSort={SortBy.ALPHABETICAL}
      filters={[]}
    />
  );
}
