import { Router } from "express";
import { login, signup, signupWithGmail } from "./auth.service.js";
import { successResponse } from "../../utils/index.js";
import * as validator from "./auth.validation.js";
import { badReqException } from "../../common/errors/error.exception.js";
import { validation } from "../../middleware/validation.middleware.js";

const authController = Router();
// 1 add user
authController.post("/signup", validation(validator.signup),async (req, res, next) => {
  //const { fullName, email, password } = req.body;

  const user = await signup(req.body);
  return successResponse(res, 201, "created", user);
});
//////////////////////////////////////////////////////////
authController.post("/loginWithGmail", async (req, res, next) => {
  //const { fullName, email, password } = req.body;
  const data = await signupWithGmail(req.body);
  return successResponse(res, 200, "created", data);
});
///////////////////////////////////////////////////////////////////////////////////////
//2 login
authController.post("/login", validation(validator.login),async (req, res, next) => {
  let issuer = "sara7a app";
  console.log({v : req.validate});
 // const { email, password } = req.body;
  const user = await login(req.validate.body, issuer);
  return successResponse(res, 201, "loggedin", user);
});

export default authController;
