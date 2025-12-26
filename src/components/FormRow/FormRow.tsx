import _uniqueId from "lodash/uniqueId";
import { FormRowContext } from "./FormRowContext";

export default function FormRow({
  label,
  description,
  error,
  children,
}: {
  label?: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = _uniqueId();
  return (
    <FormRowContext value={{ id, error }}>
      <div className="col-span-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm/6 font-medium text-gray-900"
          >
            {label}
          </label>
        )}
        <div className="mt-2 grid grid-cols-1">{children}</div>
        {description && (
          <p className="mt-3 text-sm/6 text-gray-600">{description}</p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </FormRowContext>
  );
}
