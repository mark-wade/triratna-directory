import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorState from "./ErrorState";

test.each([
  [404, "Not Found", "Sorry, we couldn’t find the page you’re looking for."],
  [
    429,
    "Too Many Requests",
    "Sorry, our server needs a moment to not get too overloaded. Please wait a minute and then try again.",
  ],
  [
    500,
    "Internal Server Error",
    "Sorry, we are having some technical difficulties. Please wait a minute and then try again.",
  ],
  [
    999,
    "Something Went Wrong",
    "Sorry, we are having some technical difficulties. Please wait a minute and then try again.",
  ],
])(
  "shows correct messages",
  async (statusCode, expectedHeading, expectedMessage) => {
    const { asFragment } = render(<ErrorState statusCode={statusCode} />);

    expect(screen.getByRole("heading")).toHaveTextContent(expectedHeading);
    expect(screen.getByText(expectedMessage)).toBeVisible();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveTextContent("Go back home");

    expect(asFragment()).toMatchSnapshot();
  }
);
