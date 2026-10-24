import jwt from "jsonwebtoken";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router";
import { UserCircleIcon } from "@heroicons/react/24/outline";

// Takes the user to the About page, which has the install, share and sign out options. This used
// to open a menu, but on iPhone Duo its items only worked some of the time
export function ProfileLink() {
  const [cookies] = useCookies(["jwt"]);
  const token = jwt.decode(cookies["jwt"]);

  return (
    <NavLink
      to="/about"
      className="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <span className="absolute -inset-1.5" />
      <span className="sr-only">About and account</span>
      {token !== null && typeof token === "object" && token.photo ? (
        <img
          alt=""
          src={token.photo}
          className="size-8 rounded-full object-cover bg-gray-50 outline -outline-offset-1 outline-black/5"
        />
      ) : (
        <UserCircleIcon aria-hidden="true" className="size-6 text-white" />
      )}
    </NavLink>
  );
}
