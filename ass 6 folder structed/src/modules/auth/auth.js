import { Router } from "express";
import {db} from "../../database/db.js";
import { signup } from "./auth.service.js";
import { successResponse } from "../../utils/index.js";

const authController = Router();

authController.post("/signup", async (req, res, next) => {
  const user = await signup(req.body);
  return successResponse(res, 201, "created", user);
});
///////////////////////////////////////////////////////////////////////////////////////
//login
// authController.post("/login", async (req, res, next) => {
//   const user = await login (req.body);
//   return successResponse  ({ res ,data: user });
// });

export default authController;
