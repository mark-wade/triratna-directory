import { ReactElement } from "react";

export type DataSource = "maitrijala" | "terasa";

export interface DataResponse {
  orderMembers: Record<string, OrderMember>;
  locations: Record<string, OrdinationLocation>;
}

export type Gender = "Male" | "Female"; // | "NonBinary";

export type AreaName =
  | "India"
  | "Mainland Europe"
  | "UK&Ireland"
  | "North America"
  | "LatinAmerica"
  | "Oceania";
interface Area {
  name: string;
}
export const AREAS: Record<AreaName, Area> = {
  India: {
    name: "India",
  },
  "Mainland Europe": {
    name: "Mainland Europe",
  },
  "UK&Ireland": {
    name: "UK & Ireland",
  },
  "North America": {
    name: "North America",
  },
  LatinAmerica: {
    name: "Latin America",
  },
  Oceania: {
    name: "Oceania",
  },
};

export type Status = "Active" | "Deceased" | "Resigned" | "Removed";

export interface OrderMember {
  name: string;
  meaning?: string;
  gender: Gender | null;
  pronouns?: string;
  status: Status;
  area: AreaName | null;
  sadhana?: string;
  events: OrderMemberEvent[];
  image: string | null;
  contact?: ContactDetails;
}
export type OrderMemberEventType =
  | "ordained"
  | "died"
  | "resigned"
  | "suspended"
  | "reinstated"
  | "removed";
export interface OrderMemberEvent {
  type: OrderMemberEventType;
  date?: string;
}
export interface OrderMemberEventOrdained extends OrderMemberEvent {
  type: "ordained";
  privatePreceptor: string;
  publicPreceptor: string;
  location: string;
}

export interface OrdinationLocation {
  name: string;
  type:
  | "retreat_centre"
  | "buddhist_centre"
  | "community"
  | "town_or_city"
  | "unknown";
  country?: string;
}

export interface ContactDetails {
  address: Address | null;
  personalEmail: string | null;
  workEmail: string | null;
  mobilePhone: string | null;
  homePhone: string | null;
  workPhone: string | null;
}

export interface Address {
  addressLines: string[] | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
  position?: Position;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface SortOption {
  by: SortBy;
  title: string;
}

export enum SortBy {
  ALPHABETICAL,
  OLDEST,
  NEWEST,
  BUBBLE,
}

export interface Filter {
  key: string;
  name: string;
  type: "single" | "multi";
  defaultValue: string | string[];
  options: FilterOption[];
  forceShowActive?: boolean;
}
export interface FilterOption {
  value: string;
  name: string;
}

export interface TableRowData {
  key: string;
  link: string;
  image: string | null;
  title: string;
  description: ReactElement | null;
  date: Date | null;
  badge: string | null;
  bubble: number[];
  filterValues: Record<string, string[]>;
}
