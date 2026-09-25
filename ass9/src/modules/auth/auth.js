import { Router } from "express";
import { login, signup, signupWithGmail } from "./auth.service.js";
import { successResponse } from "../../utils/index.js";

const authController = Router();
// 1 add user
authController.post("/signup", async (req, res, next) => {
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
authController.post("/login", async (req, res, next) => {
  const { email, password  } = req.body;
  const user = await login({ email, password });
  return successResponse(res, 201, "loggedin", user);
});

export default authController;
