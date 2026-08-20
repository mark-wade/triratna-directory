import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import LazyLoadingTable from "../LazyLoadingTable/LazyLoadingTable";
import { TableRowData } from "../../utilities/types";

// The arrow keys move between profiles, but only when they aren't wanted for something else -
// moving the cursor within a field, picking an option in a dropdown, or moving around a dialog
// such as the update details form, where the table behind it shouldn't be navigating at all
function isTypingOrInADialog(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.closest("input, textarea, select, [contenteditable='true']") !==
      null || target.closest("[role='dialog']") !== null
  );
}

export default function NavigatableTable({
  data,
  queryString,
  scrolledTo,
  topOffset,
}: {
  data: TableRowData[];
  queryString: string;
  scrolledTo: string | undefined;
  topOffset: number;
}) {
  const location = useLocation();

  let navigate = useNavigate();
  let { name } = useParams<{ name: string }>();

  useEffect(() => {
    function handleKeypress(e: KeyboardEvent): void {
      if (isTypingOrInADialog(e.target)) {
        return;
      }
      if (e.code === "ArrowDown" || e.code === "ArrowUp") {
        e.preventDefault();
        const currentRowIndex = data.findIndex((row) => row.key === name);
        const direction = e.code === "ArrowDown" ? 1 : -1;
        const newRow = data[currentRowIndex + direction];
        if (newRow !== undefined) {
          navigate(newRow.link + "?" + queryString, {
            replace: true,
            state: location.state,
          });
        }
      }
    }
    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener("keydown", handleKeypress);
  }, [data, location.state, name, navigate]);

  return (
    <LazyLoadingTable
      data={data}
      active={name}
      queryString={queryString}
      scrolledTo={scrolledTo}
      topOffset={topOffset}
    />
  );
}
