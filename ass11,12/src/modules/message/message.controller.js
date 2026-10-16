import { Router } from "express";
import { newsuccessResponse } from "../../utils/res.js";
import { createmessage, deleteMessage, getAllMessages, getoneMessage } from "./message.service.js";
import { localMulterMiddleware } from "../../middleware/multer.middleware.js";
import {
  fileValidation,
  localFileUpload,
} from "../../utils/multer/local.multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import { createMessage , allMessage, deleteM } from "./message.validation.js";
import { decodeToken } from "../../security/token.js";
import {
  authentication,
  authorization,
  barerAuth,
} from "../../middleware/auth.middelware.js";
import { validate } from "zod";
const messageFolderName = "messages";
export const messageCont = Router();
messageCont.post(
  "/create",
  async (req, res, next) => {
    if (req.headers["authorization"]) {
      await barerAuth({ req });
    }
    next();
  },
  localMulterMiddleware({
    multerMiddleware: localFileUpload().array("attachments", 3),
    validation: fileValidation.image,
    customPath: messageFolderName,
    isRequired: true,
  }),
  validation(createMessage),
  async (req, res, next) => {
    const data = await createmessage(req.body, req.files, req.user);
    console.log(req.files);
    return newsuccessResponse({ res, data });
  },
);

messageCont.get("/getAll", authentication(),validation(allMessage), async (req, res, next) => {
  const data = await getAllMessages(req.validate.query, req.user);
    return newsuccessResponse({ res, data });
});

messageCont.delete("/delete/:messageId", authentication(),validation(deleteM), async (req, res, next) => {
  const data = await deleteMessage(req.validate.params.messageId, req.user);
    return newsuccessResponse({ res, data });
});

messageCont.get("/getmessage/:messageId", authentication(),validation(deleteM), async (req, res, next) => {
  const data = await getoneMessage(req.validate.params.messageId, req.user);
    return newsuccessResponse({ res, data });
});

///////////////
messageCont.post("/IdentityRequest/:messageId", async (req, res, next) => {
  const request = await createIdentityRequest(
    req.params.messageId,
    req.query.id,
  );

  return newsuccessResponse({ res, data });
});
///////////////////////////////
requestController.get("/getRequests", async (req, res, next) => {
  const data = await getRequests({
    receiverID: req.query.id,
  });

  return newsuccessResponse({ res, data });
});
/////////////////
requestController.patch("/:requestId", async (req, res, next) => {
  const data = await updateRequestStatus({
    requestId: req.params.requestId,
    user: req.user,
    status: req.body.status,
  });
  return newsuccessResponse({ res, data });
});
