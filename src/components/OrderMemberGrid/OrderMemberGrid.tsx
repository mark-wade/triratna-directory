import { Link, useLocation } from "react-router";
import { OrderMember, OrderMemberEvent } from "../../utilities/types";
import OrderMemberPhoto from "../OrderMemberPhoto/OrderMemberPhoto";
import { formatDate } from "../../utilities/dates";
import { uniqueId } from "lodash";

export default function OrderMemberGrid({
  oms,
  navTitle,
}: {
  oms: { event: OrderMemberEvent; om: OrderMember; id: string }[];
  navTitle: string;
}) {
  const location = useLocation();
  const previousNavs = location.state ?? [];

  let i = 0;
  return (
    <ul className="my-10 grid gap-x-4 gap-y-8 text-center grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10">
      {oms.map(({ event, om, id }) => (
        <li key={uniqueId()}>
          <Link
            to={"/order-members/" + id}
            viewTransition
            state={[...previousNavs, navTitle]}
          >
            <OrderMemberPhoto
              name={id}
              orderMember={om}
              className="mx-auto size-24 rounded-md"
              color={i++}
            />
            <p className="mt-3 text-gray-900">{om.name}</p>
            {event.date && (
              <p className="text-sm/6 text-gray-600">
                {formatDate(new Date(event.date))}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
