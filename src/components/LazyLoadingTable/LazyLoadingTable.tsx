import AutoSizer from "react-virtualized-auto-sizer";
import { TableRowData } from "../../utilities/types";
import TableRow from "../TableRow/TableRow";
import { FixedSizeList } from "react-window";
import { useEffect, useRef } from "react";

export default function LazyLoadingTable({
  data,
  active,
  queryString,
  scrolledTo,
  navTitle,
  topOffset,
}: {
  data: TableRowData[];
  active?: string;
  queryString?: string;
  scrolledTo: string | undefined;
  navTitle: string;
  topOffset: number;
}) {
  return (
    <AutoSizer>
      {({ height, width }) => <LazyLoadingTableWithSize
        height={height}
        width={width}
        data={data}
        active={active}
        queryString={queryString}
        scrolledTo={scrolledTo}
        navTitle={navTitle}
        topOffset={topOffset}
      />}
    </AutoSizer>
  );
}

function LazyLoadingTableWithSize({
  height,
  width,
  data,
  active,
  queryString,
  scrolledTo,
  navTitle,
  topOffset,
}: {
  height: number;
  width: number;
  data: TableRowData[];
  active?: string;
  queryString?: string;
  scrolledTo: string | undefined;
  navTitle: string;
  topOffset: number;
}) {
  const listRef = useRef<FixedSizeList>(null);

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
      <TableRow
        row={data[index]}
        active={active}
        queryString={queryString}
        navTitle={navTitle}
      />
    </div>
  );

  return (
    <FixedSizeList
      ref={listRef}
      height={height - topOffset}
      itemCount={data.length}
      itemSize={73}
      width={width}
    >
      {Row}
    </FixedSizeList>
  );
}