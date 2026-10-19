import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { orderMemberToTableRow } from "./tableConverters";
import { orderMembersWithOptedOut } from "../tests/testData";

function rowFor(name: string) {
  return orderMemberToTableRow(
    name,
    orderMembersWithOptedOut[name],
    orderMembersWithOptedOut,
    "maitrijala"
  );
}

describe("an Order member who has asked not to be shown", () => {
  test("only shows their name, status, and the years they were ordained and left", () => {
    const row = rowFor("testordermember");
    const { container } = render(<>{row.description}</>);

    expect(row.title).toBe("Test Order member");
    expect(container).toHaveTextContent(/^2012—2019$/);
    expect(row.image).toBeNull();
    expect(row.badge).toBe("Resigned");
  });

  test("can only be found by filtering on their status", () => {
    expect(rowFor("testordermember").filterValues).toEqual({
      gender: [],
      area: [],
      status: ["Resigned"],
      sadhana: [],
      preceptors: [],
    });
  });

  test("does not show how many people they ordained", () => {
    expect(rowFor("testordermember").bubble).toEqual([]);
  });

  test("still counts towards their preceptor's disciples", () => {
    expect(rowFor("testpreceptor").bubble).toEqual([1, 2]);
  });
});
