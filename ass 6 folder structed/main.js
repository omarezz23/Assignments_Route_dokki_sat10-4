import cors from "cors";
//import { app, server } from "./server/server.js";
import { auth, authorCont, logCont } from "./src/modules/index.js";
import { globalErrorHandling } from "./src/middleware/index.js";
import { connectDB, app, port } from "./src/database/index.js";
import { bookCont } from "./src/modules/books/index.js";
import { successResponse } from "./src/utils/res.js";

connectDB(app, port);

app.get("/", async (req, res) => {
  try {
    return successResponse(res, 201, "welcome bitches");
  } catch (error) {
    console.log(error);
  }
});

app.use("/book", bookCont);
app.use("/auth", auth);
app.use("/log",logCont)
app.use("/author",authorCont)
app.all("/*dummy", (req, res) => {
  res.status(404).json({ messege: "invaild" });
});

app.use(globalErrorHandling);
