import jwt from "jsonwebtoken";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { samlLogout } from "../../utilities/saml";

export function ProfileDropdown({
  menuAnchor,
}: {
  menuAnchor: "top start" | "bottom end";
}) {
  const [cookies] = useCookies(["jwt"]);
  const token = jwt.decode(cookies["jwt"]);

  function logoutClick() {
    document.cookie = "jwt=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    samlLogout(
      token !== null ? (token.sub as string) : "",
      (error, logout_url) => {
        if (error) {
          window.location.href = "https://thebuddhistcentre.com"; // We have to send them somewhere otherwise it'll just try to log them back in
        } else {
          window.location.href = logout_url;
        }
      }
    );
  }

  return (
    <Menu as="div" className="relative ml-3">
      <MenuButton className="cursor-pointer relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500">
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Open user menu</span>
        {token !== null && typeof token === "object" && token.photo ? (
          <img
            alt="Menu"
            src={token.photo}
            className="size-8 rounded-full object-cover bg-gray-50 outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10"
          />
        ) : (
          <UserCircleIcon className="size-6 text-white" />
        )}
      </MenuButton>

      <MenuItems
        transition
        anchor={menuAnchor}
        className="absolute z-100 mt-2 w-48 rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
      >
        <MenuItem>
          <NavLink
            to="/about"
            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
          >
            About
          </NavLink>
        </MenuItem>
        <MenuItem>
          <button
            onClick={logoutClick}
            className="w-full text-left cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
          >
            Sign out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
