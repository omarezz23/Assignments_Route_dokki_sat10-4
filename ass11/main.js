import cors from "cors";
//////////////////////////////////////////////////////////////////////////////////////////
// import { decrypt, encrypt } from "./src/security/encryption.js";
// const message = "Hello World";
// const encrypted =await encrypt(message);
// const decrypted =await decrypt(encrypted);
// console.log({ encrypted, decrypted });
////////////////////////////////////////////////////////////////////////////////////
// import crypto from 'crypto';
// console.log(crypto.randomBytes(32).toString('hex'));
// console.log(crypto.randomBytes(16).toString('hex'));
//////////////////////////////////////////////////////////////////////////////////////

//import { app, server } from "./server/server.js";
//import { auth } from "./src/modules/index.js";
import { globalErrorHandling } from "./src/middleware/index.js";
import { connectDB, app, PORT } from "./src/database/index.js";
import { successResponse } from "./src/utils/index.js";
import { auth } from "./src/modules/auth/index.js";
import { userCont } from "./src/modules/users/index.js";
import { set ,keys } from "./src/common/services/cach.service.js";

//==========================================================//
await connectDB(app, PORT);

// await set({ key: "userAge", value: "27" });
// await set({ key: "userName", value: "Omar" });
// await set({ key: "userGender", value: "male" });
// console.log(await keys({ prefix: "user" }));
//==========================================================//
app.get("/", async (req, res) => {
  return successResponse(res, 201, "welcome bitches");
});
//==========================================================//
app.use("/auth", auth);
app.use("/user", userCont);
app.use(cors())
//==========================================================//
app.all("/*dummy", (req, res) => {
  return successResponse(res, 404, "invalid bitches");
});
//==========================================================//
app.use(globalErrorHandling);
