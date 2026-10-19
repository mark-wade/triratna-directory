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
  test("only shows their name and the year they were ordained", () => {
    const row = rowFor("testordermember");
    const { container } = render(<>{row.description}</>);

    expect(row.title).toBe("Test Order member");
    expect(container).toHaveTextContent(/^2012$/);
    expect(row.image).toBeNull();
    expect(row.badge).toBeNull();
  });

  test("can't be found by filtering on their details or status", () => {
    expect(rowFor("testordermember").filterValues).toEqual({
      gender: [],
      area: [],
      status: [],
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
