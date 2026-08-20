import { FormEvent, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { OrderMember } from "../../utilities/types";
import { DataContext } from "../DataContext/DataContext";
import SidebarDialog from "../Drawer/Drawer";
import Form from "../Form/Form";
import FormRow from "../FormRow/FormRow";
import FormInput from "../FormInput/FormInput";
import FormSelect from "../FormSelect/FormSelect";
import Button from "../Button/Button";
import Alert from "../Alert/Alert";
import { FormState, ValidationMessages } from "./UpdateContactDetails.types";
import {
  buildUpdate,
  contactToFormValues,
  countryOptions,
  formValuesFromFormData,
  formValuesToContact,
  messageForError,
  submitContactDetails,
  validateFormValues,
} from "./UpdateContactDetails.utils";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

export default function UpdateContactDetails({
  om,
  name,
}: {
  om: OrderMember;
  // The key this member is held under, which isn't always the same as om.name
  name: string;
}) {
  const { authenticatedUser, updateOrderMemberContact } =
    useContext(DataContext);
  const [cookies] = useCookies(["jwt"]);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("ready");
  const [validationMessages, setValidationMessages] =
    useState<ValidationMessages>({});
  const [errorMessage, setErrorMessage] = useState("");
  // What we believe is currently saved, which is what each submission is compared against to work
  // out the changes to send
  const [values, setValues] = useState(() => contactToFormValues(om.contact));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    const submittedValues = formValuesFromFormData(
      new FormData(e.target as HTMLFormElement)
    );

    const messages = validateFormValues(
      submittedValues,
      values,
      authenticatedUser
    );
    setValidationMessages(messages);
    if (Object.keys(messages).length > 0) {
      return;
    }

    const update = buildUpdate(submittedValues, values);
    if (!update) {
      setOpenClosed(false);
      return;
    }

    setFormState("loading");
    try {
      await submitContactDetails({
        token: cookies.jwt,
        contactDetails: update,
      });

      setValues(submittedValues);
      updateOrderMemberContact(name, formValuesToContact(submittedValues));
      setFormState("ready");
      setOpenClosed(false);
      toast("Your details have been updated.", { type: "success" });
    } catch (error) {
      console.error(error);
      setErrorMessage(messageForError(error));
      setFormState("error");
    }
  }

  function setOpenClosed(open: boolean) {
    setOpen(open);
    if (!open) {
      setValidationMessages({});
      setErrorMessage("");
      setTimeout(() => {
        setFormState("ready");
      }, 1000);
    }
  }

  return (
    <>
      <Button
        buttonStyle="primary"
        className="mt-4 px-3 py-2"
        onClick={() => setOpenClosed(true)}
      >
        Update Profile
      </Button>
      <SidebarDialog
        title="Update Your Details"
        open={open}
        setOpen={setOpenClosed}
      >
        <Form
          className="flex min-h-0 flex-1 flex-col divide-y divide-gray-200"
          onSubmit={onSubmit}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="relative mt-3 flex-1 px-4">
              {formState === "error" && (
                <Alert title="Your details were not updated" className="mb-5">
                  <p>{errorMessage}</p>
                </Alert>
              )}

              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-500/10 dark:outline dark:outline-blue-500/20 mb-4">
                <div className="flex">
                  <div className="shrink-0">
                    <InformationCircleIcon aria-hidden="true" className="size-5 text-blue-400" />
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      To opt out of having your details displayed at all, visit{" "}
                      <a
                        href="https://thebuddhistcentre.com/user"
                        target="_blank"
                        className="font-semibold" rel="noreferrer"
                      >
                        my order info
                      </a>
                      {" "}and disable sharing to the order address list.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <FormRow
                  label="Personal email"
                  error={validationMessages.personalEmail}
                >
                  <FormInput
                    name="personalEmail"
                    value={values.personalEmail}
                    inputMode="email"
                    autoComplete="email"
                  />
                </FormRow>
                <FormRow label="Work email" error={validationMessages.workEmail}>
                  <FormInput
                    name="workEmail"
                    value={values.workEmail}
                    inputMode="email"
                  />
                </FormRow>

                <FormRow label="Mobile phone">
                  <FormInput
                    name="mobilePhone"
                    value={values.mobilePhone}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </FormRow>
                <FormRow label="Home phone">
                  <FormInput
                    name="homePhone"
                    value={values.homePhone}
                    inputMode="tel"
                  />
                </FormRow>
                <FormRow label="Work phone">
                  <FormInput
                    name="workPhone"
                    value={values.workPhone}
                    inputMode="tel"
                  />
                </FormRow>

                {values.addressLines.map((addressLine, index) => (
                  <FormRow key={index} label={`Address line ${index + 1}`}>
                    <FormInput
                      name="addressLines"
                      value={addressLine}
                      autoComplete={index === 0 ? "address-line1" : undefined}
                    />
                  </FormRow>
                ))}
                <FormRow label="City or town">
                  <FormInput
                    name="city"
                    value={values.city}
                    autoComplete="address-level2"
                  />
                </FormRow>
                <FormRow label="County or state">
                  <FormInput
                    name="state"
                    value={values.state}
                    autoComplete="address-level1"
                  />
                </FormRow>
                <FormRow label="Postcode">
                  <FormInput
                    name="postcode"
                    value={values.postcode}
                    autoComplete="postal-code"
                  />
                </FormRow>
                {/* FormSelect renders its own label, so the row doesn't get one */}
                <FormRow>
                  <FormSelect
                    name="country"
                    label="Country"
                    options={countryOptions(values.country)}
                    value={values.country}
                    images={false}
                  />
                </FormRow>
              </div>

              <h3 className="mt-8 text-sm font-semibold text-gray-900">
                Anything else
              </h3>
              <div className="mt-2 space-y-2 pb-6">
                <p className="text-sm text-gray-500">
                  To update your photo, email a high-resolution, uncropped colour
                  photo to{" "}
                  <a
                    href={
                      "mailto:shabda@triratnaorder.org?subject=" +
                      encodeURIComponent(om.name + "+P")
                    }
                    className="text-indigo-600"
                  >
                    shabda@triratnaorder.org
                  </a>{" "}
                  with your name in the subject line followed by +P. Ideally,
                  your photo should have a pale background. It will take several
                  weeks for a new photo to be updated in the directory.
                </p>
                <p className="text-sm text-gray-500">
                  If there are any mistakes in your other details, use the
                  &ldquo;Give Feedback&rdquo; link at the bottom of your profile
                  to let us know.
                </p>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 justify-end px-4 pt-4">
            <Button
              buttonStyle="secondary"
              onClick={() => setOpenClosed(false)}
              className="px-3 py-2"
              state={formState === "loading" ? "disabled" : "active"}
            >
              Cancel
            </Button>
            <Button
              buttonStyle="primary"
              type="submit"
              className="ml-4 px-3 py-2"
              state={formState === "loading" ? "loading" : "active"}
            >
              {formState === "loading" ? "Saving" : "Save Changes"}
            </Button>
          </div>
        </Form>
      </SidebarDialog>
    </>
  );
}
