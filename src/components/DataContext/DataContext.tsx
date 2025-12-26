import { createContext } from "react";
import {
  DataSource,
  OrderMember,
  OrdinationLocation,
  TableRowData,
} from "../../utilities/types";

export interface DataContextValue {
  source: DataSource;
  orderMembers: Record<string, OrderMember>;
  orderMemberRows: TableRowData[];
  locations: Record<string, OrdinationLocation>;
  locationRows: TableRowData[];
}

export const DataContext = createContext<DataContextValue>({
  source: "maitrijala",
  orderMembers: {},
  orderMemberRows: [],
  locations: {},
  locationRows: [],
});
