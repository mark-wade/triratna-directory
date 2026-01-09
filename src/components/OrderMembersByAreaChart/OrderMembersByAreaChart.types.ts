import { AreaName, Gender } from "../../utilities/types";

export type OrderMembersByAreaData = Record<AreaName | "Unknown", Record<Gender | "Unknown", number>>;