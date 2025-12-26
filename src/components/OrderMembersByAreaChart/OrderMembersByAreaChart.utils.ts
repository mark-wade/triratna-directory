import { OrderMembersByAreaData } from "./OrderMembersByAreaChart.types";

export function emptyOrderMembersByAreaData(): OrderMembersByAreaData {
  return {
    India: {
      Male: 0,
      Female: 0
    },
    "Mainland Europe": {
      Male: 0,
      Female: 0
    },
    "UK&Ireland": {
      Male: 0,
      Female: 0
    },
    "North America": {
      Male: 0,
      Female: 0
    },
    LatinAmerica: {
      Male: 0,
      Female: 0
    },
    Oceania: {
      Male: 0,
      Female: 0
    }
  };
}