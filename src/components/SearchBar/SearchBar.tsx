import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  toggleFilterDialog,
  onKeyDown,
}: {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  toggleFilterDialog?: () => void;
  onKeyDown?: () => void;
}) {
  const searchbarRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function handleKeypress(e: KeyboardEvent): void {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        searchbarRef?.current?.focus();
      }
    }
    document.addEventListener("keypress", handleKeypress);
    return () => document.removeEventListener("keypress", handleKeypress);
  }, []);

  return (
    <div className="flex h-14 shrink-0 items-center px-4 border-t border-b border-gray-200">
      <div className="flex flex-1 self-stretch">
        <div className="grid flex-1 grid-cols-1">
          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            className="col-start-1 row-start-1 block size-full bg-white pl-8 text-gray-900 outline-hidden placeholder:text-gray-400 text-sm/6"
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchbarRef}
            autoCorrect="off"
            value={searchQuery}
            onKeyDown={onKeyDown}
          />
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
          />
        </div>
        {toggleFilterDialog && (
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="relative inline-block text-left">
              <button
                onClick={toggleFilterDialog}
                className="p-2.5 text-gray-400 hover:text-gray-500 cursor-pointer"
              >
                <span className="sr-only">Filters</span>
                <AdjustmentsHorizontalIcon
                  aria-hidden="true"
                  className="size-6"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
