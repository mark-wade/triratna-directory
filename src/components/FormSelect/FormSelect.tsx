import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { FormSelectOption } from "./FormSelect.types";

export default function FormSelect({
  name,
  label,
  options,
  value,
  setValue,
}: {
  name: string;
  label: string;
  options: FormSelectOption[];
  value?: string;
  setValue?: (v: string) => void;
}) {
  const [selected, setSelected] = useState(value);
  const selectedOption = options.find((option) => option.key === selected);

  function onChange(newValue: string) {
    setSelected(newValue);
    if (setValue) {
      setValue(newValue);
    }
  }

  return (
    <Listbox value={value} onChange={onChange}>
      <input type="hidden" name={name} value={selected} />
      <Label className="block text-sm/6 font-medium text-gray-900">
        {label}
      </Label>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
            {selectedOption && <FormSelectImage option={selectedOption} />}
            <span className="block truncate">
              {selectedOption ? selectedOption.label : ""}
            </span>
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.key}
              value={option.key}
              className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
            >
              <div className="flex items-center">
                <FormSelectImage option={option} />
                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                  {option.label}
                </span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

function FormSelectImage({ option }: { option: FormSelectOption }) {
  return option.image ? (
    <img
      alt={option.label}
      src={option.image}
      className="size-5 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span className="size-5 rounded-full inline-flex items-center justify-center bg-gray-500">
      <span className="font-medium text-white">{option.label[0]}</span>
    </span>
  );
}
