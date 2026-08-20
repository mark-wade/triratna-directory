export type FormState = "ready" | "loading" | "error";

export interface ContactDetailsFormValues {
  personalEmail: string;
  workEmail: string;
  mobilePhone: string;
  homePhone: string;
  workPhone: string;
  addressLines: string[];
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export type ContactDetailsField = keyof ContactDetailsFormValues;

export type ValidationMessages = Partial<Record<ContactDetailsField, string>>;

export interface AddressUpdate {
  addressLines?: string[] | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
}

export interface ContactDetailsUpdate {
  personalEmail?: string | null;
  workEmail?: string | null;
  mobilePhone?: string | null;
  homePhone?: string | null;
  workPhone?: string | null;
  address?: AddressUpdate;
}
