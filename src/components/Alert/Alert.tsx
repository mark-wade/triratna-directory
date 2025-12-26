import { XCircleIcon } from "@heroicons/react/20/solid";

export default function Alert({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"rounded-md bg-red-50 p-4 " + className}>
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium text-red-800">{title}</h3>
          )}
          <div className="mt-2 text-sm text-red-700">{children}</div>
        </div>
      </div>
    </div>
  );
}
