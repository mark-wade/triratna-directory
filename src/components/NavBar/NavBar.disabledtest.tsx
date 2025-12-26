import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import NavBar from "./NavBar";
import { MemoryRouter } from "react-router";

// TODO: Disabled

test("for larger screens, there is a vertical bar with 5 nav items", async () => {
  const { asFragment } = render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );

  expect(screen.getByRole("navigation")).toBeVisible();
  expect(screen.getAllByRole("link").length).toBe(5);

  expect(asFragment()).toMatchSnapshot();
});

test("for smaller screens, the navigation is in a dialog that is revealed when a button is clicked", async () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );

  expect(screen.queryByRole("dialog")).toBeNull();

  await userEvent.click(screen.getByRole("button"));

  expect(screen.getByRole("dialog")).toBeVisible();
});
