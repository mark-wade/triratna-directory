import { OrderMember } from "../../utilities/types";
import { normaliseSadhanaName } from "../../utilities/sadhanas";
import { SadhanaCounts } from "./SadhanaChart.types";

// An order member can have taken up more than one sadhana, recorded as a comma separated list
function getSadhanas(orderMember: OrderMember) {
  return (orderMember.sadhana?.split(",") ?? [])
    .map((sadhana) => normaliseSadhanaName(sadhana.trim()))
    .filter((sadhana): sadhana is string => sadhana !== null && sadhana !== "");
}

export function getSadhanaCounts(
  orderMembers: Record<string, OrderMember>
): SadhanaCounts {
  return Object.values(orderMembers).reduce((accumulator, om) => {
    for (const sadhana of getSadhanas(om)) {
      if (accumulator[sadhana] === undefined) {
        accumulator[sadhana] = { Male: 0, Female: 0, Unknown: 0 };
      }
      accumulator[sadhana][om.gender ?? "Unknown"]++;
    }
    return accumulator;
  }, {} as SadhanaCounts);
}

function sumArray(array: number[]) {
  return array.reduce((partialSum, a) => partialSum + a, 0);
}

export function getMostPopularSadhanas(counts: SadhanaCounts, limit: number) {
  return Object.keys(counts)
    .sort(
      (a, b) =>
        sumArray(Object.values(counts[b])) - sumArray(Object.values(counts[a]))
    )
    .slice(0, limit);
}

// Round the axis up to the next gridline so the longest bar doesn't stop short of the end
export function getAxisMax(
  counts: SadhanaCounts,
  sadhanas: string[],
  interval: number
) {
  const largest = sadhanas.reduce(
    (max, sadhana) => Math.max(max, sumArray(Object.values(counts[sadhana]))),
    0
  );
  return Math.max(Math.ceil(largest / interval), 1) * interval;
}
