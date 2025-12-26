import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  ChartBarIcon,
  ClockIcon,
  MapIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import {
  ChartBarIcon as ChartBarIconOutline,
  ClockIcon as ClockIconOutline,
  MapIcon as MapIconOutline,
  QuestionMarkCircleIcon,
  UsersIcon as UsersIconOutline,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Logo } from "../Logo/Logo";
import { NavLink } from "react-router";
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

export default function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // TODO: See if we can figure out a way to have hitting the bottom nav
  // do a view transition *only* if you are inside a sub-page of that nav - eg
  // Order Members -> Locations = should not transition
  // Order Members -> Order Members = should not transition
  // Order Members -> A specific Order Member = should transition forward
  // A specific Order Member -> Order Members = should transition backward

  // TODO: About page is not currently accessible on mobile

  return (
    <div>
      {/* The sidebar that shows on smaller screens after the button is clicked */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <Logo />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )
                            }
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon.outline
                              aria-hidden="true"
                              className="size-6 shrink-0"
                            />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white",
                          "group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                        )
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <QuestionMarkCircleIcon
                        aria-hidden="true"
                        className="size-6 shrink-0"
                      />
                      Information
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

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

      {/* The top bar that always shows on smaller screens - TODO: I'd like to move back here */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
        <div className="flex-1 text-sm/6 font-semibold text-white">
          Triratna Buddhist Order
        </div>
        <ProfileDropdown menuAnchor="bottom end" />
      </div>

      {/* The bottom bar that always shows on smaller screens - TODO: Is missing about page */}
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
