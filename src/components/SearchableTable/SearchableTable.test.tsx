import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchableTable from "./SearchableTable";
import { AREAS, SortBy, TableRowData } from "../../utilities/types";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { orderMemberRows } from "../../tests/testData";

jest.mock("../NavigatableTable/NavigatableTable", () => {
  return {
    __esModule: true,
    default: ({ data }: { data: TableRowData[] }) => (
      <div role="list">
        {data.map((row) => (
          <div role="listitem" key={row.key}>
            {row.title}
          </div>
        ))}
      </div>
    ),
  };
});
jest.mock("../SkeletonTable/SkeletonTable", () => {
  return {
    __esModule: true,
    default: () => <>Loading...</>,
  };
});

test("shows the items", () => {
  const { asFragment } = renderSearchableTable();
  expectNumberOfResults(orderMemberRows.length);
  expect(asFragment()).toMatchSnapshot();
});

describe("sort/filter button and dialog", () => {
  test("does not show the sort/filter button if no sort/filter options", () => {
    renderSearchableTable({ filters: false, sortOptions: false });
    expect(screen.queryByRole("button")).toBeNull();
  });

  test("shows the sort/filter button if there is at least one filter", () => {
    renderSearchableTable({ filters: true, sortOptions: false });
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("shows the sort/filter button if there is at least two sort options", () => {
    renderSearchableTable({ filters: false, sortOptions: true });
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("clicking the sort/filter button opens the dialog", async () => {
    renderSearchableTable();
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("searching", () => {
  test("shows the items filtered by the search query provided as a prop", () => {
    renderSearchableTable({ searchQuery: "kumara" }); // Should match only Dhammakumāra
    expectNumberOfResults(1);
  });

  test("does a fuzzy search - eg dharma matches dhamma", () => {
    renderSearchableTable({ searchQuery: "dharmakumara" }); // Should match Dhammakumāra
    expectNumberOfResults(1);
  });

  test("typing into the search bar updates the search query prop", async () => {
    const setSearchQuery = jest.fn(() => {});
    renderSearchableTable({ setSearchQuery: setSearchQuery });

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "Hello, World!" },
    });

    expect((setSearchQuery.mock.calls[1] as string[])[0]).toBe("Hello, World!");
  });

  test("typing into the search bar calls the onFilterOrSearchChange callback", async () => {
    const onFilterOrSearchChange = jest.fn(() => {});
    renderSearchableTable({ onFilterOrSearchChange: onFilterOrSearchChange });

    fireEvent.keyDown(screen.getByRole("searchbox"));

    expect(onFilterOrSearchChange.mock.calls).toHaveLength(1);
  });
});

describe("sorting", () => {
  describe("sorts correctly based on sort provided as a prop", () => {
    test("alphabetical", () => {
      renderSearchableTable({ defaultSort: SortBy.ALPHABETICAL });
      const results = screen.getAllByRole("listitem");
      expect(results[0]).toHaveTextContent("Dhammakumāra");
      expect(results[1]).toHaveTextContent("Maitreyabandhu");
      expect(results[2]).toHaveTextContent("Śrīkīrtī");
    });
    test("oldest", () => {
      renderSearchableTable({ defaultSort: SortBy.OLDEST });
      const results = screen.getAllByRole("listitem");
      expect(results[0]).toHaveTextContent("Maitreyabandhu");
      expect(results[1]).toHaveTextContent("Śrīkīrtī");
      expect(results[2]).toHaveTextContent("Dhammakumāra");
    });
    test("newest", () => {
      renderSearchableTable({ defaultSort: SortBy.NEWEST });
      const results = screen.getAllByRole("listitem");
      expect(results[0]).toHaveTextContent("Dhammakumāra");
      expect(results[1]).toHaveTextContent("Śrīkīrtī");
      expect(results[2]).toHaveTextContent("Maitreyabandhu");
    });
    test("bubble", () => {
      renderSearchableTable({ defaultSort: SortBy.BUBBLE });
      const results = screen.getAllByRole("listitem");
      expect(results[0]).toHaveTextContent("Maitreyabandhu");
      expect(results[1]).toHaveTextContent("Śrīkīrtī");
      expect(results[2]).toHaveTextContent("Dhammakumāra");
    });
  });

  test("changing the sort option updates the view", async () => {
    // First render with alphabetical sorting
    renderSearchableTable({ defaultSort: SortBy.ALPHABETICAL });
    const results = screen.getAllByRole("listitem");
    expect(results[0]).toHaveTextContent("Dhammakumāra");
    expect(results[1]).toHaveTextContent("Maitreyabandhu");
    expect(results[2]).toHaveTextContent("Śrīkīrtī");

    // Open the sort/filter menu, change the sort, and then close the menu
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(
      screen.getByRole("radio", { name: "Date Ordained (oldest first)" })
    );
    await userEvent.click(screen.getByRole("button", { name: "Close menu" }));

    // Verify results now show sorted by oldest first
    const newResults = screen.getAllByRole("listitem");
    expect(newResults[0]).toHaveTextContent("Maitreyabandhu");
    expect(newResults[1]).toHaveTextContent("Śrīkīrtī");
    expect(newResults[2]).toHaveTextContent("Dhammakumāra");
  });
});

describe("filtering", () => {
  describe("when a filter is used", () => {
    beforeEach(() => {
      renderSearchableTable({ queryString: "preceptors=private" });
    });

    test("shows the items filtered by the filter provided in the query string", () => {
      // Should match Srikirti and Maitreyabandhu
      expectNumberOfResults(2);
    });

    test("shows the active filter in the filters bar", () => {
      expect(screen.getByText("Private Preceptors")).toBeVisible();
    });

    test("allows clicking the cross icon on the active filter to clear it", async () => {
      const clearButton = screen.getByRole("button", {
        name: "Remove filter for Private Preceptors",
      });
      await userEvent.click(clearButton);
      expectNumberOfResults(orderMemberRows.length);
    });
  });

  test("can be combined with search query", () => {
    // Should match only Maitreyabandhu
    renderSearchableTable({
      queryString: "preceptors=private",
      searchQuery: "bandhu",
    });
    expectNumberOfResults(1);
  });

  test("accepts multiple values and will match on any", () => {
    renderSearchableTable({ queryString: "status=Deceased&status=Active" });
    expectNumberOfResults(3);
  });

  test("changing the filter updates the view", async () => {
    // First render with everything
    renderSearchableTable({ defaultSort: SortBy.ALPHABETICAL });
    expectNumberOfResults(orderMemberRows.length);

    // Open the sort/filter menu, apply a filter, and then close the menu
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("radio", { name: "Oceania" }));
    await userEvent.click(screen.getByRole("button", { name: "Close menu" }));

    // Verify results now show only 1 (Dhammakumāra)
    expectNumberOfResults(1);
  });
});

test("shows a skeleton", () => {
  renderSearchableTable({ skeleton: true });
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

function expectNumberOfResults(expected: number) {
  expect(screen.getAllByRole("listitem")).toHaveLength(expected);
  if (expected !== orderMemberRows.length) {
    expect(screen.getByText(`${expected} results`)).toBeInTheDocument();
  }
}

// TODO: The effects, and maybe other tests

function renderSearchableTable({
  queryString,
  filters,
  sortOptions,
  searchQuery,
  setSearchQuery,
  defaultSort,
  onFilterOrSearchChange,
  skeleton,
}: {
  queryString?: string;
  filters?: boolean;
  sortOptions?: boolean;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  defaultSort?: SortBy | undefined;
  onFilterOrSearchChange?: () => void | undefined;
  skeleton?: boolean;
} = {}) {
  return render(
    <MemoryRouter
      initialEntries={queryString ? [`?${queryString}`] : undefined}
    >
      <SearchableTable
        data={orderMemberRows}
        searchQuery={searchQuery !== undefined ? searchQuery : ""}
        setSearchQuery={setSearchQuery ? setSearchQuery : () => {}}
        sortOptions={
          sortOptions === false
            ? []
            : [
                {
                  by: SortBy.ALPHABETICAL,
                  title: "Name",
                },
                {
                  by: SortBy.OLDEST,
                  title: "Date Ordained (oldest first)",
                },
                {
                  by: SortBy.NEWEST,
                  title: "Date Ordained (newest first)",
                },
                {
                  by: SortBy.BUBBLE,
                  title: "Most Disciples",
                },
              ]
        }
        defaultSort={defaultSort ? defaultSort : SortBy.ALPHABETICAL}
        filters={
          filters === false
            ? []
            : [
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
                  key: "area",
                  name: "Area",
                  type: "single",
                  defaultValue: "",
                  options: [
                    {
                      value: "",
                      name: "Show All",
                    },
                    ...Object.entries(AREAS).map(([k, v]) => {
                      return {
                        value: k,
                        name: v.name,
                      };
                    }),
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
              ]
        }
        onFilterOrSearchChange={
          onFilterOrSearchChange ? onFilterOrSearchChange : () => {}
        }
        scrolledTo={undefined}
        skeleton={skeleton ? skeleton : undefined}
      />
    </MemoryRouter>
  );
}
