type ButtonStyle = "primary" | "secondary";

export default function Button({
  buttonStyle,
  type,
  state,
  className,
  onClick,
  children,
}: {
  buttonStyle: ButtonStyle;
  type?: "button" | "submit" | "reset";
  state?: "active" | "disabled" | "loading";
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  switch (buttonStyle) {
    case "primary":
      className +=
        " text-white" +
        (state === "active" || state === undefined
          ? " bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          : " bg-indigo-300");
      break;
    case "secondary":
      className +=
        " bg-white ring-1 ring-gray-300 ring-inset" +
        (state === "active" || state === undefined
          ? " text-gray-900 hover:ring-gray-400"
          : " text-gray-400");
      break;
  }

  if (state !== "active" && state !== undefined) {
    className += " cursor-not-allowed";
  }

  return (
    <button
      type={type ? type : "button"}
      className={
        className + " rounded-md text-sm font-semibold shadow-xs inline-flex"
      }
      disabled={state !== "active" && state !== undefined}
      onClick={onClick}
    >
      {state === "loading" && (
        <svg
          className="mr-3 -ml-1 size-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
