import { FormEvent, useContext, useState } from "react";
import FormSelect from "../FormSelect/FormSelect";
import FormRadio from "../FormRadio/FormRadio";
import { DataContext } from "../DataContext/DataContext";
import Form from "../Form/Form";
import FormRow from "../FormRow/FormRow";
import FormTextarea from "../FormTextarea/FormTextarea";
import { DialogTitle } from "@headlessui/react";
import Button from "../Button/Button";
import { CheckIcon } from "@heroicons/react/24/outline";
import Alert from "../Alert/Alert";
import { FeedbackType, ReportDataType, FormState } from "./Feedback.types";
import { submitFeedback } from "./Feedback.utils";
import SidebarDialog from "../Drawer/Drawer";
import { photoForOrderMember } from "../../utilities/photos";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

export default function Feedback({
  className,
  defaultType,
  defaultData,
  defaultDataValue,
}: {
  className?: string;
  defaultType?: FeedbackType;
  defaultData?: ReportDataType;
  defaultDataValue?: string;
}) {
  const { source, orderMembers, locations } = useContext(DataContext);
  const [cookies] = useCookies(["jwt"]);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("ready");
  const [feedbackValidationMessage, setFeedbackValidationMessage] =
    useState<string>("");
  const [type, setType] = useState<FeedbackType>(
    defaultType ? defaultType : "data"
  );
  const [data, setData] = useState<ReportDataType>(
    defaultData ? defaultData : "om"
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedbackValidationMessage("");

    const formData = new FormData(e.target as HTMLFormElement);

    const feedback = formData.get("feedback") as string;
    if (!feedback || feedback.trim() === "") {
      setFeedbackValidationMessage("Please let us know what your feedback is.");
      return;
    }

    setFormState("loading");
    try {
      await submitFeedback({
        token: cookies.jwt,
        type,
        data,
        dataValue: (data === "om"
          ? formData.get("om")
          : formData.get("location")) as string,
        feedback: feedback,
      });

      setFeedbackValidationMessage("");
      setFormState("ready");
      setOpen(false);
      toast("Your feedback has been sent successfully.", { type: "success" });
    } catch (error) {
      console.error(error);
      setFormState("error");
    }
  }

  function setOpenClosed(open: boolean) {
    setOpen(open);
    if (!open) {
      setFeedbackValidationMessage("");
      setTimeout(() => {
        setFormState("ready");
      }, 1000);
    }
  }

  return (
    <div>
      <button onClick={() => setOpenClosed(true)} className={className}>
        Give Feedback
      </button>
      <SidebarDialog
        title="Give Us Feedback"
        open={open}
        setOpen={setOpenClosed}
      >
        {formState === "done" ? (
          <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl p-10">
            <div className="my-auto">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon
                  aria-hidden="true"
                  className="size-6 text-green-600"
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900"
                >
                  Feedback sent
                </DialogTitle>
                <Button
                  buttonStyle="secondary"
                  onClick={() => setOpenClosed(false)}
                  className="px-3 py-2 mt-3"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Form
            className="flex h-full flex-col divide-y divide-gray-200"
            onSubmit={onSubmit}
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="relative mt-6 flex-1 px-4">
                {formState === "error" && (
                  <Alert title="Error submitting feedback" className="mb-5">
                    <p>
                      There was an error and your feedback was not submitted.
                      Please wait a moment and try again.
                    </p>
                  </Alert>
                )}
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <FormRow>
                    <FormRadio
                      name="type"
                      label="What do you want to tell us about?"
                      options={[
                        {
                          value: "data",
                          label: "Report incorrect or missing data",
                        },
                        {
                          value: "feedback",
                          label: "Give general feedback on the app",
                        },
                      ]}
                      value={type}
                      setValue={(v) => setType(v)}
                    />
                  </FormRow>
                  {type === "data" && (
                    <FormRow>
                      <FormRadio
                        name="data"
                        label="Who/what has incorrect or missing data?"
                        options={[
                          {
                            value: "om",
                            label: "An order member",
                          },
                          {
                            value: "location",
                            label: "An ordination location",
                          },
                          {
                            value: "other",
                            label: "Something else",
                          },
                        ]}
                        value="om"
                        setValue={(v) => setData(v)}
                      />
                    </FormRow>
                  )}
                  {type === "data" && data === "om" && (
                    <FormRow>
                      <FormSelect
                        name="om"
                        label="Which order member has the problem?"
                        options={Object.entries(orderMembers)
                          .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                          .map(([k, om]) => {
                            return {
                              key: k,
                              label: om.name,
                              image: om.image
                                ? (process.env.PHOTOS_BASE_URL ??
                                    "https://photos.triratna.directory") +
                                  "/" +
                                  om.image
                                : undefined,
                            };
                          })}
                        value={
                          defaultData === "om" ? defaultDataValue : undefined
                        }
                      />
                    </FormRow>
                  )}
                  {type === "data" && data === "location" && (
                    <FormRow>
                      <FormSelect
                        name="location"
                        label="Which location has the problem?"
                        options={Object.entries(locations)
                          .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                          .map(([k, location]) => {
                            return {
                              key: k,
                              label: location.name,
                              image: undefined,
                            };
                          })}
                        value={
                          defaultData === "location"
                            ? defaultDataValue
                            : undefined
                        }
                      />
                    </FormRow>
                  )}
                  <FormRow
                    label="What do you want to tell us?"
                    error={feedbackValidationMessage}
                  >
                    <FormTextarea name="feedback" />
                  </FormRow>
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
                {formState === "loading" ? "Sending Feedback" : "Send Feedback"}
              </Button>
            </div>
          </Form>
        )}
      </SidebarDialog>
    </div>
  );
}
