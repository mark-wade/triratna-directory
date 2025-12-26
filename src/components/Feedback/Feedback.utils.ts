import { FeedbackType, ReportDataType } from "./Feedback.types";

export async function submitFeedback({token, type, data, dataValue, feedback}: {token: string; type: FeedbackType; data: ReportDataType; dataValue: string; feedback: string;}) {
  const response = await fetch(getFeedbackUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      data,
      dataValue,
      feedback,
    }),
  });

  if (response.status !== 200) {
    throw new Error(`Bad response: ${response.status}`);
  }
}

function getFeedbackUrl() {
  return (
    (process.env.API_URL
      ? process.env.API_URL
      : "https://api.triratna.directory") + "/feedback"
  );
}