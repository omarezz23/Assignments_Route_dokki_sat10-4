import cors from "cors";
//import { app, server } from "./server/server.js";
//import { auth } from "./src/modules/index.js";
import { globalErrorHandling } from "./src/middleware/index.js";
import { connectDB, app, port } from "./src/database/index.js";
import { successResponse } from "./src/utils/index.js";
import { auth } from "./src/modules/auth/index.js";
import { userCont } from "./src/modules/users/index.js";
import { notesCont } from "./src/modules/notes/index.js";

connectDB(app, port);

app.get("/", async (req, res) => {
  try {
    return successResponse(res, 201, "welcome bitches");
  } catch (error) {
    console.log(error);
  }
});

app.use("/auth", auth);
app.use("/user", userCont);
app.use("/notes", notesCont);

app.all("/*dummy", (req, res) => {
  res.status(404).json({ messege: "invalid Bitch" });
});

app.use(globalErrorHandling);
