import { uniqueId } from "lodash";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export interface FeedItem {
  iconBackground: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
  title: React.ReactNode;
  description?: string;
}

export default function Feed({ timeline }: { timeline: FeedItem[] }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timeline.map((event, eventIdx) => (
          <li key={uniqueId()}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-white/10"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={classNames(
                      event.iconBackground,
                      "flex size-8 items-center justify-center rounded-full ring-8 ring-white dark:ring-gray-900"
                    )}
                  >
                    <event.icon
                      aria-hidden="true"
                      className="size-5 text-white"
                    />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm">{event.title}</p>
                    {event.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
