import { OrderMember } from "../../utilities/types";

export default function OrderMemberPhoto({
  name,
  orderMember,
  className,
  color,
}: {
  name: string;
  orderMember: OrderMember;
  className?: string;
  color?: number;
}) {
  return orderMember.image ? (
    <img
      alt={orderMember.name}
      src={
        (process.env.PHOTOS_BASE_URL ?? "https://photos.triratna.directory") +
        "/" +
        orderMember.image
      }
      className={className + " flex-none bg-gray-50 object-cover"}
      loading="lazy"
    />
  ) : (
    <span
      className={
        className +
        " inline-flex items-center justify-center " +
        (color !== undefined ? getColor(color) : "bg-gray-500")
      }
    >
      <span className="text-lg font-medium text-white">
        {orderMember.name[0]}
      </span>
    </span>
  );
}

const colors = [
  "bg-red-300",
  "bg-orange-300",
  "bg-yellow-300",
  "bg-green-300",
  "bg-cyan-300",
  "bg-indigo-300",
  "bg-fuchsia-300",
];
function getColor(i: number) {
  for (let j = 0; j < colors.length; j++) {
    if (i % colors.length === j) {
      const color = colors[j];
      return color;
    }
  }
  return "gray";
}
