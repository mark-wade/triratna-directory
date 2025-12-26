export function InformationTableRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-4 sm:grid sm:grid-cols-3 lg:block xl:grid xl:grid-cols-5">
      <dt className="text-sm font-medium text-gray-900">{label}</dt>
      <dd className="text-sm/6 text-gray-700 mt-1 sm:mt-0 sm:col-span-2 lg:mt-1 xl:mt-0 xl:col-span-4">
        {children}
      </dd>
    </div>
  );
}
