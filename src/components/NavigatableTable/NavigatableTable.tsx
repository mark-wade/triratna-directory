import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import LazyLoadingTable from "../LazyLoadingTable/LazyLoadingTable";
import { TableRowData } from "../../utilities/types";

export default function NavigatableTable({
  data,
  queryString,
  scrolledTo,
}: {
  data: TableRowData[];
  queryString: string;
  scrolledTo: string | undefined;
}) {
  let navigate = useNavigate();
  let { name } = useParams<{ name: string }>();
  useEffect(() => {
    function handleKeypress(e: KeyboardEvent): void {
      if (e.code === "ArrowDown" || e.code === "ArrowUp") {
        e.preventDefault();
        const currentRowIndex = data.findIndex((row) => row.key === name);
        const direction = e.code === "ArrowDown" ? 1 : -1;
        const newRow = data[currentRowIndex + direction];
        if (newRow !== undefined) {
          navigate(newRow.link);
        }
      }
    }
    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener("keydown", handleKeypress);
  }, [data, name, navigate]);

  return (
    <LazyLoadingTable
      data={data}
      active={name}
      queryString={queryString}
      scrolledTo={scrolledTo}
    />
  );
}
