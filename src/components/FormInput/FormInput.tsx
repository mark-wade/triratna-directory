import { useContext } from "react";
import { FormRowContext } from "../FormRow/FormRowContext";

export default function FormInput({
  name,
  value = "",
  inputMode,
  autoComplete,
}: {
  name: string;
  value?: string;
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
}) {
  const context = useContext(FormRowContext);

  return (
    <input
      id={context?.id}
      name={name}
      type="text"
      inputMode={inputMode}
      autoComplete={autoComplete}
      aria-invalid={context?.error ? true : undefined}
      className={
        "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" +
        (context?.error
          ? " text-red-900 outline-red-300 placeholder:text-red-300"
          : "")
      }
      defaultValue={value}
    />
  );
}
