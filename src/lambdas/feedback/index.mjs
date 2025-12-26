import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import jwt from 'jsonwebtoken';

const ses = new SESClient({ region: "eu-west-2" });

export const handler = async (event) => {
  const token = event.headers.authorization.replace(/^Bearer /, '');
  const decoded = jwt.decode(token);

  try {
    const body = JSON.parse(event.body);
    let subjectLine = "Feedback from " + decoded.name;
    const messageBody = body.feedback;
    if (!messageBody) {
      return {
        statusCode: 400,
        headers: {},
        body: JSON.stringify({ message: "No feedback provided" }),
      };
    }
    if (!["feedback", "data"].includes(body.type)) {
      return {
        statusCode: 400,
        headers: {},
        body: JSON.stringify({ message: "Invalid type" }),
      };
    }
    if (body.type === "data") {
      if (!["om", "location"].includes(body.data)) {
        return {
          statusCode: 400,
          headers: {},
          body: JSON.stringify({ message: "Invalid data" }),
        };
      }
      if (!body.dataValue) {
        return {
          statusCode: 400,
          headers: {},
          body: JSON.stringify({ message: "No entity provided" }),
        };
      }
      subjectLine = "Reporting Issue about " + body.dataValue;
    }

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: (body.type === "feedback" ? process.env.FEEDBACK_EMAIL_RECIPIENTS : process.env.REPORT_ISSUE_EMAIL_RECIPIENTS).split(","),
      },
      Message: {
        Body: {
          Text: { Data: messageBody },
        },
        Subject: { Data: subjectLine },
      },
      Source: process.env.EMAIL_SENDER,
      ReplyToAddresses: [decoded.sub]
    });
    
    await ses.send(command);
    
    return {
      statusCode: 200,
      headers: {},
      body: '',
    };
  }
  catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      headers: {},
      body: '',
    };
  }
};