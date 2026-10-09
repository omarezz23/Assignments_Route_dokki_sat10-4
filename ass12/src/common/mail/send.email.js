import nodemailer from "nodemailer";
import {
  APP_EMAIL,
  APP_PASSWORD,
  APPLICATION_NAME,
} from "../../config/config.js";
import { badReqException } from "../errors/error.exception.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  cc,
  bcc,
  subject,
  text,
  html,
  attachments = [],
}) => {
  try {
    if(!to.length && !cc.length && !bcc.length) {
      throw badReqException("At least one recipient (to, cc, bcc) is required.");
    }
    if(!subject && !text && !html) {
      throw badReqException("At least one of subject, text, or html is required.");
    }
    const info = await transporter.sendMail({
      from: `'"${APPLICATION_NAME}""${APP_EMAIL}"`,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
