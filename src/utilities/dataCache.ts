import { ContactDetails, DataResponse } from "./types";

export const SCHEMA_VERSION = "2025-12-30";

// Always written together - a cacheData without a matching cacheTime would either be ignored or
// kept for too long
export function writeCachedData(data: DataResponse) {
  localStorage.setItem("cacheData", JSON.stringify(data));
  localStorage.setItem("cacheTime", new Date().getTime().toString());
  localStorage.setItem("cacheSchemaVersion", SCHEMA_VERSION);
}

// Returns the updated data and caches it, so that a member's own change survives a reload rather
// than disappearing again until the next refresh
export function updateCachedOrderMemberContact(
  data: DataResponse,
  name: string,
  contact: ContactDetails
): DataResponse {
  const updatedData = {
    ...data,
    orderMembers: {
      ...data.orderMembers,
      [name]: { ...data.orderMembers[name], contact },
    },
  };
  writeCachedData(updatedData);
  return updatedData;
}
