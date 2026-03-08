import { createContext } from "react";
import {
  DataSource,
  OrderMember,
  OrdinationLocation,
  TableRowData,
} from "../../utilities/types";

export interface DataContextValue {
  source: DataSource;
  authenticatedUser?: string;
  orderMembers: Record<string, OrderMember>;
  orderMemberRows: TableRowData[];
  locations: Record<string, OrdinationLocation>;
  locationRows: TableRowData[];
}

export const DataContext = createContext<DataContextValue>({
  source: "maitrijala",
  authenticatedUser: undefined,
  orderMembers: {},
  orderMemberRows: [],
  locations: {},
  locationRows: [],
});
