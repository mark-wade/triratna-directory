import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { orderMembers } from "../../tests/testData";
import OrderMemberPhoto from "./OrderMemberPhoto";

test("shows photo if the Order Member has one", () => {
  render(
    <OrderMemberPhoto
      name="dhammakumara"
      orderMember={orderMembers.dhammakumara}
    />
  );

  expect(screen.getByRole("img")).toBeVisible();
});

test("shows initial if the Order Member does not have a photo", () => {
  const orderMemberWithoutPhoto = { ...orderMembers.dhammakumara };
  orderMemberWithoutPhoto.image = null;

  render(
    <OrderMemberPhoto
      name="dhammakumara"
      orderMember={orderMemberWithoutPhoto}
    />
  );

  expect(screen.queryByRole("img")).toBeNull();
  expect(screen.getByText("D")).toBeVisible();
});
