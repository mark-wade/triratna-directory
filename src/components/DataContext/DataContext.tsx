import { createContext } from "react";
import {
  ContactDetails,
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
  // Lets a member's own changes show up straight away rather than waiting for the cached data to
  // be refetched
  updateOrderMemberContact: (name: string, contact: ContactDetails) => void;
}

export const DataContext = createContext<DataContextValue>({
  source: "maitrijala",
  authenticatedUser: undefined,
  orderMembers: {},
  orderMemberRows: [],
  locations: {},
  locationRows: [],
  updateOrderMemberContact: () => {},
});
