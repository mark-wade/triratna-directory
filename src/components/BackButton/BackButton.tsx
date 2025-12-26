import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

export default function BackButton({ to }: { to: string }) {
  return "";

  const navigate = useNavigate();

  function onClick() {
    document.documentElement.classList.add("back-transition");
    navigate(-1);
    setTimeout(function () {
      document.documentElement.classList.remove("back-transition");
    }, 500);
  }

  return (
    <nav aria-label="Back" className="lg:hidden p-3">
      <button
        onClick={onClick}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <ChevronLeftIcon
          aria-hidden="true"
          className="mr-1 -ml-1 size-5 shrink-0 text-gray-400"
        />
        Back
      </button>
    </nav>
  );
}
