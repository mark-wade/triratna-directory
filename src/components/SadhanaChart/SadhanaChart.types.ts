import { Gender } from "../../utilities/types";

export type SadhanaCounts = Record<string, Record<Gender | "Unknown", number>>;
