import { useEffect, useRef, useState } from "react";
import {
  TableRowData,
  SortOption,
  SortBy,
  Filter,
} from "../../utilities/types";
import SearchableTable from "../SearchableTable/SearchableTable";
import "./MasterDetailTable.css";

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
  const detailView = useRef<HTMLDivElement>(null);

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

  // Whenever the detail element changes, scroll to the top. Otherwise, if you
  // are viewing an Order member and slightly scrolled down, then you click on
  // their preceptor, the scroll stays scrolled down even though you have
  // navigated to a new page
  useEffect(() => {
    detailView.current?.scrollTo(0, 0);
  }, [element]);

  return (
    <div className="flex master-detail-table">
      <div
        className={
          (element ? "flex-0 lg:flex-initial" : "flex-1 lg:flex-initial") +
          " overflow-auto w-md bg-white"
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
        ref={detailView}
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
