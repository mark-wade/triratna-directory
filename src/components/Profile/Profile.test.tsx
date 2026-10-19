import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { CookiesProvider } from "react-cookie";
import Profile from "./Profile";
import { DataContext } from "../DataContext/DataContext";
import { orderMemberToTableRow } from "../../utilities/tableConverters";
import {
  locationsWithOptedOut,
  orderMembersWithOptedOut,
} from "../../tests/testData";

// Neither are needed for these Order members, and they pull in modules Jest can't load
jest.mock("../ProfileContactDetails/ProfileContactDetails", () => {
  return {
    __esModule: true,
    ProfileContactDetails: () => <></>,
  };
});
jest.mock("../UpdateContactDetails/UpdateContactDetails", () => {
  return {
    __esModule: true,
    default: () => <></>,
  };
});

function renderProfile(name: string) {
  return render(
    <CookiesProvider>
      <MemoryRouter>
        <DataContext
          value={{
            source: "maitrijala",
            orderMembers: orderMembersWithOptedOut,
            orderMemberRows: Object.entries(orderMembersWithOptedOut).map(
              ([k, v]) =>
                orderMemberToTableRow(k, v, orderMembersWithOptedOut, "maitrijala")
            ),
            locations: locationsWithOptedOut,
            locationRows: [],
            updateOrderMemberContact: () => {},
          }}
        >
          <Profile name={name} />
        </DataContext>
      </MemoryRouter>
    </CookiesProvider>
  );
}

describe("an Order member who has asked not to be shown", () => {
  test("only shows their name and why there's nothing else", () => {
    renderProfile("testordermember");

    expect(screen.getByText("Test Order member")).toBeInTheDocument();
    expect(
      screen.getByText(/This person has asked us to not show their details/)
    ).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("No photo on file.")).toBeInTheDocument();
    expect(screen.queryByText("Give Feedback")).toBeNull();
  });

  test("does not show when they were ordained, their status, preceptor or disciples", () => {
    const { container } = renderProfile("testordermember");

    expect(container).not.toHaveTextContent("2012");
    expect(container).not.toHaveTextContent("2019");
    expect(container).not.toHaveTextContent("Resigned");
    expect(container).not.toHaveTextContent("Test Preceptor");
    expect(container).not.toHaveTextContent("Test Disciple");
  });

  test("is listed by their preceptor without a photo or the exact date", () => {
    const { container } = renderProfile("testpreceptor");

    expect(screen.getAllByText("Test Order member").length).toBeGreaterThan(0);
    expect(screen.queryByAltText("Test Order member")).toBeNull();
    expect(container).toHaveTextContent("2012");
    expect(container).not.toHaveTextContent("January 2012");
    expect(container).not.toHaveTextContent("Resigned");
  });
});
