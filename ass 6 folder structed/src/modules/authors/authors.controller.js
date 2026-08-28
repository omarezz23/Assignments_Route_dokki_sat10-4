import { Router } from "express";
import { connectDB } from "../../database/index.js";
import { successResponse } from "../../utils/index.js";
import { insert } from "./authors.service.js";


export const authorCont = Router();
//2
authorCont.post("/insertauthor", async (req, res, next) => {
  const author = await insert(req.body);
  return successResponse(res, 201, "created", author);
});