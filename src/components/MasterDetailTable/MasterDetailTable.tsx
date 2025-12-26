import { useEffect, useState } from "react";
import {
  TableRowData,
  SortOption,
  SortBy,
  Filter,
} from "../../utilities/types";
import SearchableTable from "../SearchableTable/SearchableTable";

export default function MasterDetailTable({
  active,
  data,
  element,
  sortOptions,
  defaultSort,
  filters,
  skeleton,
}: {
  active?: string;
  data: TableRowData[];
  element: React.ReactNode;
  sortOptions: SortOption[];
  defaultSort: SortBy;
  filters: Filter[];
  skeleton?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolledTo, setScrolledTo] = useState<string | undefined>(undefined);

  // Whenever an entry is loaded, scroll to that entry
  // (eg on initial page load if loading URL /order-members/someone)
  useEffect(() => {
    if (active) {
      setScrolledTo(active);
    }
  }, [active]);

  function resetScroll() {
    setScrolledTo("");
  }

  return (
    <div className="flex h-full">
      <div
        className={
          (element ? "flex-0 lg:flex-initial" : "flex-1 lg:flex-initial") +
          " overflow-auto w-md"
        }
      >
        <SearchableTable
          data={data}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOptions={sortOptions}
          defaultSort={defaultSort}
          filters={filters}
          onFilterOrSearchChange={resetScroll}
          scrolledTo={scrolledTo}
          skeleton={skeleton}
        />
      </div>
      <div
        className={
          (element ? "flex-1" : "flex-0 lg:flex-1") +
          " overflow-auto bg-gray-100"
        }
      >
        {element}
      </div>
    </div>
  );
}
