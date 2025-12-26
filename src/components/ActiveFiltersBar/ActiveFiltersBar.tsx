import { Filter } from "../../utilities/types";

export default function ActiveFiltersBar({
  resultCount,
  activeFilters,
  filterValues,
  setFilterValues,
}: {
  resultCount: number;
  activeFilters: Filter[];
  filterValues: Record<string, string[]>;
  setFilterValues: (newValues: Record<string, string[]>) => void;
}) {
  const clearFilter = (filter: Filter, value: string) => {
    const newFilterValues = structuredClone(filterValues);
    if (filter.type === "single") {
      delete newFilterValues[filter.key];
    } else {
      const index = newFilterValues[filter.key].indexOf(value);
      if (index > -1) {
        newFilterValues[filter.key].splice(index, 1);
      }
    }
    setFilterValues(newFilterValues);
  };

  return (
    <section aria-labelledby="filter-heading">
      <h2 id="filter-heading" className="sr-only">
        Filters
      </h2>
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:block lg:px-4">
          <h3 className="text-sm text-gray-500">
            {resultCount.toLocaleString()} results
          </h3>
          {activeFilters.length > 0 && (
            <>
              <div
                aria-hidden="true"
                className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block lg:hidden"
              />
              <div className="mt-2 sm:mt-0 sm:ml-4 lg:mt-2 lg:ml-0">
                <div className="-m-1 flex flex-wrap items-center">
                  {activeFilters.map((activeFilter) =>
                    filterValues[activeFilter.key].map((value) => (
                      <span
                        key={activeFilter.key + "-" + value}
                        className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pr-2 pl-3 text-sm font-medium text-gray-900"
                      >
                        <span>
                          {
                            activeFilter.options.find(
                              (option) => option.value === value
                            )?.name
                          }
                        </span>
                        <button
                          aria-label={`Remove filter for ${
                            activeFilter.options.find(
                              (option) => option.value === value
                            )?.name
                          }`}
                          type="button"
                          onClick={() => clearFilter(activeFilter, value)}
                          className="ml-1 inline-flex size-4 shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 8 8"
                            className="size-2"
                          >
                            <path
                              d="M1 1l6 6m0-6L1 7"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
