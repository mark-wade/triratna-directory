import { ContactDetails } from "../../utilities/types";
import { countryNames } from "../../utilities/countries";
import { FormSelectOption } from "../FormSelect/FormSelect.types";
import {
  AddressUpdate,
  ContactDetailsFormValues,
  ContactDetailsUpdate,
  ValidationMessages,
} from "./UpdateContactDetails.types";

// Kept the same as the check in src/lambdas/update-contact-details/index.mjs so that we don't
// send anything the lambda is going to reject
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_FIELDS = ["personalEmail", "workEmail"] as const;
const PHONE_FIELDS = ["mobilePhone", "homePhone", "workPhone"] as const;
const ADDRESS_FIELDS = ["city", "state", "postcode", "country"] as const;

const FIELD_LABELS: Record<string, string> = {
  personalEmail: "Personal email",
  workEmail: "Work email",
  mobilePhone: "Mobile phone",
  homePhone: "Home phone",
  workPhone: "Work phone",
  addressLines: "Address",
  city: "City",
  state: "County or state",
  postcode: "Postcode",
  country: "Country",
};

const GENERIC_ERROR_MESSAGE =
  "There was a problem and your details were not updated. Please wait a moment and try again.";

export class ContactDetailsError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function contactToFormValues(
  contact?: ContactDetails
): ContactDetailsFormValues {
  return {
    personalEmail: contact?.personalEmail ?? "",
    workEmail: contact?.workEmail ?? "",
    mobilePhone: contact?.mobilePhone ?? "",
    homePhone: contact?.homePhone ?? "",
    workPhone: contact?.workPhone ?? "",
    // Always offer two lines, but show more if this member already has more so that saving the
    // form can't quietly drop any
    addressLines: padAddressLines(contact?.address?.addressLines ?? []),
    city: contact?.address?.city ?? "",
    state: contact?.address?.state ?? "",
    postcode: contact?.address?.postcode ?? "",
    country: contact?.address?.country ?? "",
  };
}

export function formValuesFromFormData(
  formData: FormData
): ContactDetailsFormValues {
  return {
    personalEmail: readField(formData, "personalEmail"),
    workEmail: readField(formData, "workEmail"),
    mobilePhone: readField(formData, "mobilePhone"),
    homePhone: readField(formData, "homePhone"),
    workPhone: readField(formData, "workPhone"),
    addressLines: formData.getAll("addressLines").map((line) => String(line)),
    city: readField(formData, "city"),
    state: readField(formData, "state"),
    postcode: readField(formData, "postcode"),
    country: readField(formData, "country"),
  };
}

export function validateFormValues(
  values: ContactDetailsFormValues,
  previousValues: ContactDetailsFormValues,
  authenticatedUser?: string
): ValidationMessages {
  const messages: ValidationMessages = {};

  for (const field of EMAIL_FIELDS) {
    const email = normalise(values[field]);
    if (email !== null && !EMAIL_PATTERN.test(email)) {
      messages[field] = "Please enter a valid email address.";
    }
  }

  // Both the lambda and the profile page work out whose details these are by matching the signed
  // in address against the email addresses on the record, so removing it would leave this member
  // unable to update their details at all
  if (authenticatedUser && Object.keys(messages).length === 0) {
    const stillPresent = EMAIL_FIELDS.some(
      (field) => normalise(values[field])?.toLowerCase() === authenticatedUser.toLowerCase()
    );
    if (!stillPresent) {
      const signedInField =
        normalise(previousValues.workEmail)?.toLowerCase() === authenticatedUser.toLowerCase()
          ? "workEmail"
          : "personalEmail";
      messages[signedInField] =
        `Your Order account is associated with ${authenticatedUser}, so it can't be removed here. Keep it on one of your email addresses, or visit thebuddhistcentre.com to update your primary email.`;
    }
  }

  return messages;
}

// Only sends the details that have actually been changed. The form is filled in from data that
// can be several hours old, so sending everything could put stale details back over a change
// made somewhere else in the meantime
export function buildUpdate(
  values: ContactDetailsFormValues,
  previousValues: ContactDetailsFormValues
): ContactDetailsUpdate | null {
  const update: ContactDetailsUpdate = {};

  for (const field of [...EMAIL_FIELDS, ...PHONE_FIELDS]) {
    const value = normalise(values[field]);
    if (value !== normalise(previousValues[field])) {
      update[field] = value;
    }
  }

  const address: AddressUpdate = {};
  for (const field of ADDRESS_FIELDS) {
    const value = normalise(values[field]);
    if (value !== normalise(previousValues[field])) {
      address[field] = value;
    }
  }

  const addressLines = normaliseAddressLines(values.addressLines);
  if (
    JSON.stringify(addressLines) !==
    JSON.stringify(normaliseAddressLines(previousValues.addressLines))
  ) {
    address.addressLines = addressLines;
  }

  if (Object.keys(address).length > 0) {
    update.address = address;
  }

  return Object.keys(update).length > 0 ? update : null;
}

export function countryOptions(country: string): FormSelectOption[] {
  const names = countryNames();
  // Older records hold free-text countries that aren't in the list, so keep whatever we already
  // have as an option rather than silently changing it when the form is saved
  const allNames =
    country && !names.includes(country) ? [country, ...names] : names;

  return [
    { key: "", label: "(Not recorded)" },
    ...allNames.map((name) => ({ key: name, label: name })),
  ];
}

// The lambda replies with an empty body, so to show the change straight away we rebuild the
// contact details from what was submitted. The form covers every field, so nothing is missing
export function formValuesToContact(
  values: ContactDetailsFormValues
): ContactDetails {
  const address = {
    addressLines: normaliseAddressLines(values.addressLines),
    city: normalise(values.city),
    state: normalise(values.state),
    postcode: normalise(values.postcode),
    country: normalise(values.country),
  };

  return {
    personalEmail: normalise(values.personalEmail),
    workEmail: normalise(values.workEmail),
    mobilePhone: normalise(values.mobilePhone),
    homePhone: normalise(values.homePhone),
    workPhone: normalise(values.workPhone),
    address: Object.values(address).every((value) => value === null)
      ? null
      : address,
  };
}

export async function submitContactDetails({
  token,
  contactDetails,
}: {
  token: string;
  contactDetails: ContactDetailsUpdate;
}) {
  const response = await fetch(getUpdateContactDetailsUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactDetails),
  });

  // A successful update comes back with no body at all, so there is nothing to read here
  if (response.status !== 200) {
    throw new ContactDetailsError(response.status, await messageFromResponse(response));
  }
}

export function messageForError(error: unknown): string {
  if (!(error instanceof ContactDetailsError)) {
    return GENERIC_ERROR_MESSAGE;
  }

  switch (error.status) {
    case 400:
      return error.message
        ? withFieldLabels(error.message)
        : GENERIC_ERROR_MESSAGE;
    case 401:
      return "You are no longer signed in. Please reload the page and try again.";
    case 403:
      return "We couldn't find your Order member record, so your details were not updated. Please contact hello@triratna.directory for assistance.";
    default:
      return GENERIC_ERROR_MESSAGE;
  }
}

function getUpdateContactDetailsUrl() {
  return (
    (process.env.API_URL
      ? process.env.API_URL
      : "https://api.triratna.directory") + "/update-contact-details"
  );
}

async function messageFromResponse(response: Response) {
  try {
    const body = await response.text();
    return body ? (JSON.parse(body).message ?? "") : "";
  } catch {
    return "";
  }
}

// The lambda reports problems using the field names the API uses, which aren't what the form
// calls them
function withFieldLabels(message: string) {
  return Object.entries(FIELD_LABELS).reduce(
    (result, [field, label]) => result.replaceAll(field, label),
    message
  );
}

function padAddressLines(addressLines: string[]) {
  const padded = [...addressLines];
  while (padded.length < 2) {
    padded.push("");
  }
  return padded;
}

function readField(formData: FormData, field: string) {
  return String(formData.get(field) ?? "");
}

function normalise(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function normaliseAddressLines(addressLines: string[]) {
  const lines = addressLines
    .map((line) => line.trim())
    .filter((line) => line !== "");
  return lines.length > 0 ? lines : null;
}
