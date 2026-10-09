import { Router } from "express";
import { newsuccessResponse, successResponse } from "../../utils/index.js";
import { connectDB } from "../../database/db.js";
import {
  deleteUser,
  getUser,
  updateUser,
  profile,
  updateprofile,
  rotate,
  logout,
  profileImage,
} from "./users.service.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middelware.js";
import { TokenEnum } from "../../common/enum/security.enum.js";
import { roleEnum } from "../../common/enum/role.enum.js";
import {
  fileValidation,
  localFileUpload,
  multerUpload,
} from "../../utils/multer/local.multer.js";
import { localMulterMiddleware } from "../../middleware/multer.middleware.js";

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

userCont.get("/", authentication(), async (req, res, next) => {
  const data = await profile(req.user);
  return successResponse(res, 200, "success", data);
});

userCont.patch(
  "/update",
  authentication(),
  authorization(roleEnum.ADMIN),
  async (req, res, next) => {
    const data = await updateprofile(req.user, req.body);
    return successResponse(res, 200, "success", data);
  },
);

userCont.post(
  "/rotate",
  authentication(TokenEnum.REFRESH),
  async (req, res, next) => {
    const data = await rotate(
      req.payload,
      req.user,
      `${req.protocol}://${req.host}`,
    );
    return successResponse(res, 200, "success", data);
  },
);

userCont.post("/logout", authentication(), async (req, res, next) => {
  const data = await logout(req.payload, req.user, req.body);
  return successResponse(res, 200, "success", data);
});


userCont.post(
  "/profilepicmultermiddleware",
  authentication(),
  localMulterMiddleware({
    isRequired: true,
    customPath: "Users",
    multerMiddleware: localFileUpload({ filesize: 5 }).single("imgs"),
    validation: fileValidation.image,
  }),
  async (req, res, next) => {
    const data =await profileImage(req.user, req.file);
    return newsuccessResponse({
      res,
      data,
    });
  },
);

//, `${req.protocol}://${req.host}`
//////////////////////////////////////////////////////////////
//multer//////////////////////////////////////////////////////

userCont.post(
  "/pofileimg",
  localFileUpload().array("imgs"),
  multerUpload({ validation: fileValidation.image }),
  async (req, res, next) => {
    return newsuccessResponse({
      res,
      data: { file: req.file, files: req.files },
    });
  },
);

userCont.post(
  "/pofileimgfields",
  localFileUpload().fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  multerUpload({ validation: fileValidation.image }),
  async (req, res, next) => {
    return newsuccessResponse({
      res,
      data: { file: req.file, files: req.files },
    });
  },
);


