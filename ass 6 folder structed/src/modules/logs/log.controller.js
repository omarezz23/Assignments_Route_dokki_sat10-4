import { Router } from "express";
import { connectDB } from "../../database/index.js";
import { successResponse } from "../../utils/index.js";

export const logCont = Router();
//7
logCont.post("/log",async (req,res,next)=>{
const log = await insert (req.body)
return successResponse(res, 201, "created", log);
})

//8
