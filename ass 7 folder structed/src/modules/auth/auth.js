import { Router } from "express";
import { login, signup } from "./auth.service.js";
import { successResponse } from "../../utils/index.js";

const authController = Router();
// 1 add user
authController.post("/signup", async (req, res, next) => {
  const user = await signup(req.body);
  return successResponse(res, 201, "created", user);
});
///////////////////////////////////////////////////////////////////////////////////////
//2 login
authController.post("/login", async (req, res, next) => {
const user = await login (req.body);
return successResponse(res, 201, "loggedin", user);
});

export default authController;
