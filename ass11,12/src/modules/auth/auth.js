import { Router } from "express";
import { confirmEmail, login, requestforgotPassword, resendConfirmEmail, resetpass, signup, signupWithGmail, veifyForgetPassword } from "./auth.service.js";
import { successResponse } from "../../utils/index.js";
import * as validator from "./auth.validation.js";
import { badReqException } from "../../common/errors/error.exception.js";
import { validation } from "../../middleware/validation.middleware.js";
import { genrateRateLimit } from "../../utils/limiter.js";

const authController = Router();
// 1 add user
authController.post("/signup", validation(validator.signup),async (req, res, next) => {
  //const { fullName, email, password } = req.body;

  const user = await signup(req.body);
  return successResponse(res, 201, "created", user);
});
/////////////////////////////////////////////////////////////////////////////////////////
authController.patch("/confirmmail", validation(validator.confirmEmail),async (req, res, next) => {
  const data = await confirmEmail(req.body);
  return successResponse(res, 200, "sent", data);
});
////////////////////////////////////////////////////////////////////////////
authController.post("/forgotpassword", validation(validator.resendConfirmEmail),async (req, res, next) => {
  const data = await requestforgotPassword(req.body);
  return successResponse(res, 200, "sent");
});
////////////////////////////////////////////////////////
authController.post("/verifyforgetpassotp", validation(validator.confirmEmail),async (req, res, next) => {
  const data = await veifyForgetPassword(req.body);
  return successResponse(res, 200, "sent");
});
////////////////////////////////////////////////////////
authController.patch("/resetpassword", validation(validator.resetpassword),async (req, res, next) => {
  const data = await resetpass(req.body);
  return successResponse(res, 200, "sent", data);
});
///////////////////////////////////////////////////////
authController.post("/resendotp", validation(validator.resendConfirmEmail),async (req, res, next) => {
  const data = await resendConfirmEmail(req.body);
  return successResponse(res, 201, "sent", data);
});
//////////////////////////////////////////////////////////
authController.post("/loginWithGmail", async (req, res, next) => {
  //const { fullName, email, password } = req.body;
  const data = await signupWithGmail(req.body);
  return successResponse(res, 200, "created", data);
});
///////////////////////////////////////////////////////////////////////////////////////
//2 login
const loginlimit= genrateRateLimit({limit:3 , ttl: 3 , skipSuccessfulRequests:true})

authController.post("/login",loginlimit, validation(validator.login),async (req, res, next) => {
  let issuer = "sara7a app";
  console.log({v : req.validate});
 // const { email, password } = req.body;
  const user = await login(req.validate.body, issuer);
  return successResponse(res, 201, "loggedin", user);
});

export default authController;
