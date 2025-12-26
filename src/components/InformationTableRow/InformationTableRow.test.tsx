import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InformationTableRow } from "./InformationTableRow";

test("shows the provided label and value", async () => {
  const { asFragment } = render(
    <InformationTableRow label="I am a label">
      <p>I am the value</p>
    </InformationTableRow>
  );

  expect(screen.getByRole("term")).toHaveTextContent("I am a label");
  expect(screen.getByRole("definition")).toHaveTextContent("I am the value");

  expect(asFragment()).toMatchSnapshot();
});
