export function InformationTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">{children}</dl>
      </div>
    </div>
  );
}
