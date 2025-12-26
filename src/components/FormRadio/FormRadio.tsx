import _uniqueId from "lodash/uniqueId";
import { FormRadioOption } from "./FormRadio.types";

export default function FormRadio<T extends string>({
  name,
  label,
  description,
  options,
  value,
  setValue,
}: {
  name: string;
  label?: string;
  description?: string;
  options: FormRadioOption<T>[];
  value: T | undefined;
  setValue?: (v: T) => void;
}) {
  const id = _uniqueId();

  return (
    <fieldset>
      {label && (
        <legend className="text-sm/6 font-semibold text-gray-900">
          {label}
        </legend>
      )}
      {description && (
        <p className="mt-1 text-sm/6 text-gray-600">{description}</p>
      )}
      <div className={(label ? "mt-6" : "") + " space-y-6"}>
        {options.map((option) => (
          <div key={option.value} className="flex gap-3">
            <div className="flex h-5 shrink-0 items-center">
              <input
                defaultChecked={option.value === value}
                id={id + "-" + option.value}
                name={name}
                type="radio"
                onChange={setValue ? () => setValue(option.value) : undefined}
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
              />
            </div>
            <label
              htmlFor={id + "-" + option.value}
              className="text-sm text-gray-500"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
