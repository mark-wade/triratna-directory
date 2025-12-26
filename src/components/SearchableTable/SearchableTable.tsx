import NavigatableTable from "../NavigatableTable/NavigatableTable.tsx";
import {
  Filter,
  SortBy,
  SortOption,
  TableRowData,
} from "../../utilities/types.tsx";
import { useSearchParams } from "react-router";
import { arrayContainsAny, arraysEqual } from "../../utilities/utilities.ts";
import { useEffect, useState } from "react";
import { tokenisedName } from "../../utilities/search.ts";
import SearchBar from "../SearchBar/SearchBar.tsx";
import FiltersDialog from "../FiltersDialog/FiltersDialog.tsx";
import SkeletonTable from "../SkeletonTable/SkeletonTable.tsx";
import ActiveFiltersBar from "../ActiveFiltersBar/ActiveFiltersBar.tsx";

export default function SearchableTable({
  data,
  searchQuery,
  setSearchQuery,
  sortOptions,
  defaultSort,
  filters,
  onFilterOrSearchChange,
  scrolledTo,
  skeleton,
}: {
  data: TableRowData[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  sortOptions: SortOption[];
  defaultSort: SortBy;
  filters: Filter[];
  onFilterOrSearchChange: () => void;
  scrolledTo: string | undefined;
  skeleton?: boolean;
}) {
  const [sort, setSort] = useState(defaultSort);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Reset the search query every time the search params change, otherwise
  // if you search for an OM, and then click on their Area, you'll still
  // have their name in the search box which breaks the mental model of a link
  useEffect(() => setSearchQuery(""), [searchParams, setSearchQuery]);

  const filterValues: Record<string, string[]> = {};
  filters.forEach((filter) => {
    if (searchParams.has(filter.key)) {
      filterValues[filter.key] = searchParams.getAll(filter.key);
    } else {
      if (typeof filter.defaultValue === "string") {
        filterValues[filter.key] = [filter.defaultValue];
      } else {
        filterValues[filter.key] = filter.defaultValue;
      }
    }
  });

  const activeFilters = filters.filter(
    (filter) =>
      filter.forceShowActive === true ||
      !arraysEqual(
        typeof filter.defaultValue === "string"
          ? [filter.defaultValue]
          : filter.defaultValue,
        filterValues[filter.key]
      )
  );

  function setFilterValues(newValues: Record<string, string[]>) {
    const newSearchParams = new URLSearchParams();
    Object.entries(newValues).forEach(([k, v]) => {
      const filter = filters.find((f) => f.key === k);
      if (filter) {
        if (typeof filter.defaultValue === "string") {
          if (v[0] !== filter.defaultValue) {
            newSearchParams.set(k, v[0]);
          }
        } else {
          if (!arraysEqual(v, filter.defaultValue)) {
            newSearchParams.delete(k);
            v.forEach((_v) => {
              newSearchParams.append(k, _v);
            });
          }
        }
      }
    });
    if (newSearchParams.size > 0 && searchParams.has("in")) {
      newSearchParams.append("in", searchParams.get("in") as string);
    }
    setSearchParams(newSearchParams);
    onFilterOrSearchChange();
  }

  const tokenisedSearchQuery = searchQuery
    ? tokenisedName(searchQuery)
    : undefined;
  const rows = data
    .filter((row) => {
      for (const filter of filters) {
        if (
          !arraysEqual(filterValues[filter.key], [""]) &&
          !arrayContainsAny(
            filterValues[filter.key],
            row.filterValues[filter.key]
          )
        ) {
          return false;
        }
      }

      if (
        tokenisedSearchQuery &&
        !tokenisedName(row.title).includes(tokenisedSearchQuery)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case SortBy.ALPHABETICAL:
        default:
          return a.title.localeCompare(b.title);
        case SortBy.OLDEST:
          if (!a.date) {
            return 1;
          }
          if (!b.date) {
            return -1;
          }
          return (
            (a.date ? a.date.valueOf() : 0) - (b.date ? b.date.valueOf() : 0)
          );
        case SortBy.NEWEST:
          return (
            (b.date ? b.date.valueOf() : 0) - (a.date ? a.date.valueOf() : 0)
          );
        case SortBy.BUBBLE:
          return (
            b.bubble.reduce((s, n) => s + n, 0) -
            a.bubble.reduce((s, n) => s + n, 0)
          );
      }
    });

  // If we are trying to scroll to someone who is  not in the results (eg you search
  // for an OM by name, open their profile, and then click on their preceptor), reset
  // the search so that they are there
  useEffect(() => {
    if (
      scrolledTo &&
      rows.find((row) => row.key === scrolledTo) === undefined
    ) {
      setSearchQuery("");
    }
    // We are *deliberately* not including rows here because we only want to do this
    // on initial load, not every time the user types iunto the search (which will
    // change the value of rows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrolledTo, setSearchQuery]);

  return (
    <>
      <div className="sticky top-0 z-40 bg-white shadow-xs">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleFilterDialog={
            filters.length > 0 || sortOptions.length > 1
              ? () => setFilterDialogOpen(!filterDialogOpen)
              : undefined
          }
          onKeyDown={onFilterOrSearchChange}
        />
        {(filters.length > 0 || sortOptions.length > 1) && (
          <>
            <FiltersDialog
              open={filterDialogOpen}
              setOpen={setFilterDialogOpen}
              filters={filters}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              sort={sort}
              setSort={setSort}
              sortOptions={sortOptions}
            />
            {(activeFilters.length > 0 || searchQuery) && (
              <ActiveFiltersBar
                resultCount={rows.length}
                activeFilters={activeFilters}
                filterValues={filterValues}
                setFilterValues={setFilterValues}
              />
            )}
          </>
        )}
      </div>
      {skeleton ? (
        <SkeletonTable />
      ) : (
        <NavigatableTable
          data={rows}
          queryString={searchParams.toString()}
          scrolledTo={searchQuery ? undefined : scrolledTo}
        />
      )}
    </>
  );
}
