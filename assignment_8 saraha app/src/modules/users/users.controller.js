import { Router } from "express";
import { successResponse } from "../../utils/index.js";
import { connectDB } from "../../database/db.js";
import { deleteUser, getUser, updateUser } from "./users.service.js";

export const userCont = Router();

//3
userCont.patch("/users/:id", async (req, res, next) => {
  const user = await updateUser(req.params.id, req.body);
  return successResponse(res, 200, "updated", user);
});

//4 delete user
userCont.delete("/users", async (req, res, next) => {
  const user = await deleteUser(req.query.id);
  return successResponse(res, 200, "user deleted", user);
});

//5 get user
userCont.get("/users", async (req, res, next) => {
  const user = await getUser(req.query.id);
  return successResponse(res, 200, "success", user);
});
