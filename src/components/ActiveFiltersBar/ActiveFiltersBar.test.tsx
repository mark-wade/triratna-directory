import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActiveFiltersBar from "./ActiveFiltersBar";
import userEvent from "@testing-library/user-event";

test("shows the number of results with comma formatting", () => {
  renderActiveFiltersBar({ resultCount: 1500 });
  expect(screen.getByText("1,500 results")).toBeVisible();
});

test("shows the active filter names", () => {
  renderActiveFiltersBar();
  expect(screen.getByText("Deceased")).toBeVisible();
  expect(screen.getByText("Resigned")).toBeVisible();
  expect(screen.getByText("Private Preceptors")).toBeVisible();
});

describe("allows clicking the cross icon on the active filter to clear it", () => {
  test("single value filter", async () => {
    const setFilterValues = jest.fn();
    renderActiveFiltersBar({ setFilterValues: setFilterValues });

    const clearButton = screen.getByRole("button", {
      name: "Remove filter for Private Preceptors",
    });
    await userEvent.click(clearButton);
    expect(setFilterValues.mock.calls[0]).toStrictEqual([
      {
        status: ["Deceased", "Resigned"],
      },
    ]);
  });

  test("multi value filter", async () => {
    const setFilterValues = jest.fn();
    renderActiveFiltersBar({ setFilterValues: setFilterValues });

    const clearButton = screen.getByRole("button", {
      name: "Remove filter for Resigned",
    });
    await userEvent.click(clearButton);
    expect(setFilterValues.mock.calls[0]).toStrictEqual([
      {
        status: ["Deceased"],
        preceptors: ["private"],
      },
    ]);
  });
});

function renderActiveFiltersBar({
  resultCount,
  setFilterValues,
}: { resultCount?: number; setFilterValues?: () => {} } = {}) {
  render(
    <ActiveFiltersBar
      resultCount={resultCount ? resultCount : 100}
      activeFilters={[
        {
          key: "status",
          name: "Status",
          type: "multi",
          defaultValue: ["Active", "Deceased", "Resigned"],
          options: [
            {
              value: "Active",
              name: "Active",
            },
            {
              value: "Deceased",
              name: "Deceased",
            },
            {
              value: "Resigned",
              name: "Resigned",
            },
          ],
        },
        {
          key: "preceptors",
          name: "Preceptors",
          type: "single",
          defaultValue: "",
          options: [
            {
              value: "",
              name: "Show All",
            },
            {
              value: "private",
              name: "Private Preceptors",
            },
            {
              value: "public",
              name: "Public Preceptors",
            },
          ],
        },
      ]}
      filterValues={{
        status: ["Deceased", "Resigned"],
        preceptors: ["private"],
      }}
      setFilterValues={setFilterValues ? setFilterValues : () => {}}
    />
  );
}
