import {
  ChartBarIcon,
  ClockIcon,
  MapIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import {
  ChartBarIcon as ChartBarIconOutline,
  ChevronLeftIcon,
  ClockIcon as ClockIconOutline,
  MapIcon as MapIconOutline,
  UsersIcon as UsersIconOutline,
} from "@heroicons/react/24/outline";
import { Logo } from "../Logo/Logo";
import { NavLink, useLocation, useNavigate } from "react-router";
import "./NavBar.css";
import { ProfileDropdown } from "../ProfileDropdown/ProfileDropdown";

const navigation = [
  {
    name: "Order",
    href: "/order-members",
    icon: { solid: UsersIcon, outline: UsersIconOutline },
  },
  {
    name: "Locations",
    href: "/locations",
    icon: { solid: MapIcon, outline: MapIconOutline },
  },
  {
    name: "History",
    href: "/history",
    icon: { solid: ClockIcon, outline: ClockIconOutline },
  },
  {
    name: "Statistics",
    href: "/stats",
    icon: { solid: ChartBarIcon, outline: ChartBarIconOutline },
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar({ title }: { title?: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleBackClick() {
    document.documentElement.classList.add("back-transition");
    navigate(-1);
    setTimeout(function () {
      document.documentElement.classList.remove("back-transition");
    }, 500);
  }

  const backTitle =
    location.state && Array.isArray(location.state)
      ? location.state[location.state.length - 1]
      : undefined;

  if (title === undefined && backTitle === undefined) {
    title = "Triratna Buddhist Order";
  }

  return (
    <div>
      {/* The sidebar that always shows on larger screens */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col lg:bg-gray-900">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Logo />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="flex flex-col items-center space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold"
                          )
                        }
                      >
                        <item.icon.outline
                          aria-hidden="true"
                          className="size-6 shrink-0"
                        />
                        <span className="sr-only">{item.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-3 pb-1 mt-auto">
                <ProfileDropdown menuAnchor="top start" />
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* The top bar that always shows on smaller screens */}
      <div
        className={
          (backTitle !== undefined && title
            ? "grid-cols-4"
            : backTitle !== undefined
            ? "grid-cols-2"
            : title
            ? "grid-cols-3"
            : "grid-cols-1") +
          " grid sticky top-0 z-40 bg-gray-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden"
        }
      >
        {backTitle !== undefined && (
          <button
            onClick={handleBackClick}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer truncate"
          >
            <ChevronLeftIcon
              aria-hidden="true"
              className="mr-1 -ml-1 size-5 shrink-0 text-gray-400"
            />
            {backTitle ? backTitle : "Back"}
          </button>
        )}
        {title && (
          <div
            className={
              (backTitle !== undefined ? "text-center" : "") +
              " col-span-2 mt-1 text-sm/6 font-semibold text-white truncate"
            }
          >
            {title}
          </div>
        )}
        <div className="flex justify-end">
          <ProfileDropdown menuAnchor="bottom end" />
        </div>
      </div>

      {/* The bottom bar that always shows on smaller screens */}
      <div className="fixed lg:hidden bottom-0 z-40 bg-gray-100 w-full border-t border-gray-200 text-center text-xs pt-2 pb-(--bottom-bar-padding)">
        <nav aria-label="Tabs" className="grid grid-cols-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )
              }
            >
              <item.icon.solid className="size-5 mx-auto mb-1" />
              <div>{item.name}</div>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
