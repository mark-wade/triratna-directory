import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { TableRowData } from "../../utilities/types";
import { Link, useLocation } from "react-router";

export default function TableRow({
  row,
  active,
  queryString,
}: {
  row: TableRowData;
  active: string | undefined;
  queryString?: string;
}) {
  const location = useLocation();
  const previousNavs = location.state ?? [];

  return (
    <div
      key={row.key}
      className={
        "relative flex justify-between gap-x-6 p-3 hover:bg-gray-50" +
        (active === row.key ? " bg-gray-100" : "")
      }
    >
      <div className="flex min-w-0 gap-x-4">
        {row.image ? (
          <img
            alt={row.title}
            src={row.image}
            className="size-12 flex-none rounded-md bg-gray-50 object-cover"
            loading="lazy"
          />
        ) : (
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-gray-500">
            <span className="text-lg font-medium text-white">
              {row.title[0]}
            </span>
          </span>
        )}
        <div className="min-w-0 flex-auto">
          <div className="flex items-start gap-x-3">
            <p className="text-sm/6 font-semibold text-gray-900">
              <Link
                to={row.link + (queryString ? `?${queryString}` : "")}
                key={row.key}
                viewTransition
                state={[...previousNavs, ""]}
              >
                <span className="absolute inset-x-0 -top-px bottom-0" />
                {row.title}
              </Link>
            </p>
            {row.badge && (
              <p className="text-gray-600 bg-gray-50 ring-gray-500/10 mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset">
                {row.badge}
              </p>
            )}
          </div>
          <p className="flex text-xs/5 text-gray-500">{row.description}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-x-4">
        {row.bubble.length > 0 && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            {row.bubble.join("+")}
          </span>
        )}
        <ChevronRightIcon
          aria-hidden="true"
          className="size-5 flex-none text-gray-400"
        />
      </div>
    </div>
  );
}
