import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InformationTable } from "./InformationTable";

test("shows the provided children", async () => {
  const { asFragment } = render(
    <InformationTable>
      <p>Hello, world!</p>
    </InformationTable>
  );

  expect(screen.getByText("Hello, world!")).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});
