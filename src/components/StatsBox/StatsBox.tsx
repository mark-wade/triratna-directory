import { Link } from "react-router";
import { StatsBoxValue } from "./Statsbox.types";

export default function StatsBox({ stats }: { stats: StatsBoxValue[] }) {
  return (
    <dl className="mt-5 grid grid-cols-2 divide-x divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-4 md:divide-x md:divide-y-0">
      {stats.map((stat) => (
        <Link to={stat.link} key={stat.label}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
            <dt className="text-sm/6 font-medium text-gray-500">
              {stat.label}
            </dt>
            <dd className={stat.valueChangeClassName + " text-xs font-medium"}>
              {stat.valueChange ? (
                <>+{stat.valueChange.toLocaleString()}</>
              ) : (
                <></>
              )}
            </dd>
            <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
              {stat.value.toLocaleString()}
            </dd>
          </div>
        </Link>
      ))}
    </dl>
  );
}
