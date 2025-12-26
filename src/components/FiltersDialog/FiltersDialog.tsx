import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction } from "react";
import { Filter, SortBy, SortOption } from "../../utilities/types";
import SidebarDialog from "../Drawer/Drawer";
import FormRadio from "../FormRadio/FormRadio";

export default function FiltersDialog({
  open,
  setOpen,
  filters,
  filterValues,
  setFilterValues,
  sort,
  setSort,
  sortOptions,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  filters: Filter[];
  filterValues: Record<string, string[]>;
  setFilterValues: (newValues: Record<string, string[]>) => void;
  sort: SortBy;
  setSort: Dispatch<SetStateAction<SortBy>>;
  sortOptions: SortOption[];
}) {
  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    radioSetValue(e.target.name, e.target.value);
  };
  const radioSetValue = (k: string, v: string) => {
    filterValues[k] = [v];
    setFilterValues(filterValues);
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilterValues = structuredClone(filterValues);
    if (e.target.checked) {
      if (!newFilterValues[e.target.name].includes(e.target.value)) {
        newFilterValues[e.target.name].push(e.target.value);
      } else {
        newFilterValues[e.target.name] = [e.target.value];
      }
    } else {
      const index = newFilterValues[e.target.name].indexOf(e.target.value);
      if (index > -1) {
        newFilterValues[e.target.name].splice(index, 1);
      }
    }
    setFilterValues(newFilterValues);
  };

  return (
    <SidebarDialog title="Filters" open={open} setOpen={setOpen}>
      <form className="mt-4">
        {filters.map((filter) => (
          <Disclosure
            defaultOpen={true}
            key={filter.key}
            as="div"
            className="border-t border-gray-200 px-4 py-6"
          >
            <h3 className="-mx-2 -my-3 flow-root">
              <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                <span className="font-medium text-gray-900">{filter.name}</span>
                <span className="ml-6 flex items-center">
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-5 rotate-0 transform group-data-open:-rotate-180"
                  />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-6">
              <div className="space-y-6">
                {filter.type === "multi" ? (
                  filter.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex gap-3">
                      <div className="flex h-5 shrink-0 items-center">
                        <div className="group grid size-4 grid-cols-1">
                          {filter.type === "multi" ? (
                            <>
                              <input
                                onChange={onCheckboxChange}
                                value={option.value}
                                defaultChecked={filterValues[
                                  filter.key
                                ].includes(option.value)}
                                id={`${filter.key}-${option.value}`}
                                name={filter.key}
                                type="checkbox"
                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                              />
                              <svg
                                fill="none"
                                viewBox="0 0 14 14"
                                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                              >
                                <path
                                  d="M3 8L6 11L11 3.5"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="opacity-0 group-has-checked:opacity-100"
                                />
                                <path
                                  d="M3 7H11"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="opacity-0 group-has-indeterminate:opacity-100"
                                />
                              </svg>
                            </>
                          ) : (
                            <input
                              onChange={onRadioChange}
                              defaultChecked={filterValues[filter.key].includes(
                                option.value
                              )}
                              id={`${filter.key}-${option.value}`}
                              name={filter.key}
                              value={option.value}
                              type="radio"
                              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                            />
                          )}
                        </div>
                      </div>
                      <label
                        htmlFor={`${filter.key}-${option.value}`}
                        className="text-sm text-gray-500"
                      >
                        {option.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <FormRadio
                    name={filter.key}
                    value={filterValues[filter.key][0]}
                    options={filter.options.map((option) => {
                      return {
                        label: option.name,
                        value: option.value,
                      };
                    })}
                    setValue={(value) => radioSetValue(filter.key, value)}
                  />
                )}
              </div>
            </DisclosurePanel>
          </Disclosure>
        ))}
        {sortOptions.length > 1 && (
          <Disclosure
            defaultOpen={true}
            key="sort"
            as="div"
            className="border-t border-gray-200 px-4 py-6"
          >
            <h3 className="-mx-2 -my-3 flow-root">
              <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                <span className="font-medium text-gray-900">Sort By</span>
                <span className="ml-6 flex items-center">
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-5 rotate-0 transform group-data-open:-rotate-180"
                  />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-6">
              <div className="space-y-6">
                {sortOptions.map((option) => (
                  <div key={option.by} className="flex gap-3">
                    <div className="flex h-5 shrink-0 items-center">
                      <div className="group grid size-4 grid-cols-1">
                        <input
                          onChange={() => setSort(option.by)}
                          defaultChecked={sort === option.by}
                          id={`sort-${option.by}`}
                          name="sort"
                          value={option.by}
                          type="radio"
                          className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                        />
                      </div>
                    </div>
                    <label
                      htmlFor={`sort-${option.by}`}
                      className="text-sm text-gray-500"
                    >
                      {option.title}
                    </label>
                  </div>
                ))}
              </div>
            </DisclosurePanel>
          </Disclosure>
        )}
      </form>
    </SidebarDialog>
  );
}
