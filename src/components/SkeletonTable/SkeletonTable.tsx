import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function SkeletonTable() {
  return (
    <div className="divide-y divide-gray-100 animate-pulse">
      {[...Array(20).keys()].map((i) => (
        <div
          key={i}
          className="relative flex justify-between gap-x-6 p-3 hover:bg-gray-50"
        >
          <div className="flex min-w-0 gap-x-4">
            <span className="inline-flex size-12 items-center justify-center rounded-md bg-gray-200"></span>
            <div className="min-w-0 flex-auto">
              <div className="flex items-start gap-x-3">
                <p className="rounded bg-gray-200 h-4 w-100">&nbsp;</p>
              </div>
              <p className="flex mt-3 rounded bg-gray-200 h-2">&nbsp;</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <ChevronRightIcon
              aria-hidden="true"
              className="size-5 flex-none text-gray-400"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
