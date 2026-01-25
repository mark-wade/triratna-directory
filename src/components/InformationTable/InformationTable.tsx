export function InformationTable({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={className + " overflow-hidden bg-white shadow-sm sm:rounded-lg"}>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">{children}</dl>
      </div>
    </div>
  );
}
