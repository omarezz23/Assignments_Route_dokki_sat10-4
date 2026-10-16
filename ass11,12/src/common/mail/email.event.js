import { EventEmitter } from "node:events";
import { sendEmail } from "./send.email.js";
import { verifyEmailTemplate } from "./email.temlate.js";
import { emailEnum } from "../enum/email.enum.js";
export const emailEvent = new EventEmitter();
export const UserEmailKey = ({email , subject})=>{
  return `user::${email}::${subject}::otp`
}
export const UserEmailTrialsKey = ({email , subject})=>{
  return `${UserEmailKey({email , subject})}::trials`
}
emailEvent.on("sendEmail", async ({ recepiant, subject, data }) => {
  try {
    await sendEmail({
      ...recepiant,
      subject,
      html: verifyEmailTemplate({code : data.code , subject , title : data.title ?? subject})
    });
  } catch (error) {
    console.log(error);
  }
});
