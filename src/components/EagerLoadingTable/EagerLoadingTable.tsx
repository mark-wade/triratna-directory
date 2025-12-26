import { TableRowData } from "../../utilities/types";
import TableRow from "../TableRow/TableRow";

export default function EagerLoadingTable({
  data,
  refs,
  active,
  queryString,
}: {
  data: TableRowData[];
  refs?: () => Map<string, HTMLElement>;
  active?: string;
  queryString?: string;
}) {
  return (
    <div className="divide-y divide-gray-100">
      {data.map((row) => (
        <TableRow
          key={row.key}
          row={row}
          refs={refs}
          active={active}
          queryString={queryString}
        />
      ))}
    </div>
  );
}
