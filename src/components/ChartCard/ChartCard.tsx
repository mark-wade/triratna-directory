export default function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-white shadow-sm mb-5 xl:mb-0">
      <div className="px-4 py-5 sm:px-6">
        <div className="-mt-4 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="mt-4 ml-4">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
