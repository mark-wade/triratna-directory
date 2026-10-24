import { NavLink } from "react-router";

const views = [
  { name: "Order members", href: "/order-members" },
  { name: "Places ordained", href: "/locations" },
];

// Switches the Order tab between the list of order members and the list of ordination locations
export default function OrderViewToggle() {
  return (
    <nav aria-label="Order view" className="inline-flex rounded-lg bg-gray-200 p-0.5">
      {views.map((view) => (
        <NavLink
          key={view.href}
          to={view.href}
          replace
          className={({ isActive }) =>
            (isActive
              ? "bg-white text-gray-900 shadow-xs"
              : "text-gray-600 hover:text-gray-900") +
            " rounded-md px-4 py-1 text-sm font-medium"
          }
        >
          {view.name}
        </NavLink>
      ))}
    </nav>
  );
}
