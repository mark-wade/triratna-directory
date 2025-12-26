import AutoSizer from "react-virtualized-auto-sizer";
import { TableRowData } from "../../utilities/types";
import TableRow from "../TableRow/TableRow";
import { FixedSizeList } from "react-window";
import { createRef, useEffect } from "react";

export default function LazyLoadingTable({
  data,
  active,
  queryString,
  scrolledTo,
}: {
  data: TableRowData[];
  active?: string;
  queryString?: string;
  scrolledTo: string | undefined;
}) {
  const listRef = createRef<FixedSizeList>();

  useEffect(() => {
    if (scrolledTo === "") {
      listRef.current?.scrollToItem(0, "start");
    } else if (scrolledTo) {
      const index = data.findIndex((row) => row.key === scrolledTo);
      if (index !== -1) {
        listRef.current?.scrollToItem(index, "center");
      }
    }
  }, [data, listRef, scrolledTo]);

  const Row = ({ index, style }: { index: number; style: any }) => (
    <div
      style={style}
      role="listitem"
      className={index !== 0 ? "border-t border-gray-100" : ""}
    >
      <TableRow row={data[index]} active={active} queryString={queryString} />
    </div>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          ref={listRef}
          height={height - 56}
          itemCount={data.length}
          itemSize={73}
          width={width}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}
