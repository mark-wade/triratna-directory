import _uniqueId from "lodash/uniqueId";
import { FormCheckboxesOption } from "./FormCheckboxes.types";

export default function FormCheckboxes({
  label,
  options,
}: {
  label: string;
  options: FormCheckboxesOption[];
}) {
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="space-y-5">
        {options.map((option) => {
          const id = _uniqueId();
          return (
            <div className="flex gap-3" key={option.key}>
              <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    defaultChecked
                    id={id}
                    name={option.key}
                    type="checkbox"
                    aria-describedby={
                      option.description ? id + "-description" : undefined
                    }
                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                  />
                  <svg
                    fill="none"
                    viewBox="0 0 14 14"
                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-checked:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-indeterminate:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-sm/6">
                <label htmlFor={id} className="font-medium text-gray-900">
                  {option.label}
                </label>
                {option.description && (
                  <p id={id + "-description"} className="text-gray-500">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
