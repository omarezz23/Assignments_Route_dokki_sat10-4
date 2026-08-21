import cors from "cors";
import { app, server } from "./server/server.js";
import { auth} from "./src/modules/index.js";
import { globalErrorHandling } from "./src/middleware/index.js";
import { db } from "./src/database/db.js";
import { userModel } from "./src/database/model/user.model.js";
import { postModel } from "./src/database/model/posts.model.js";
import { commentModel } from "./src/database/model/comments.model.js";
import userCont from "./src/modules/user/user.controller.js";
import postCont from "./src/modules/postes/posts.controller.js";
import commentCont from "./src/modules/comments/comments.controller.js";
db()
await userModel.sync({alter:true})
await postModel.sync({alter:true})
await commentModel.sync({alter:true})

app.get("/", async (req, res) => {
  await userModel.findAll()
  await postModel.findAll()
  await commentModel.findAll()
  res.status(201).json({ messege: "Welcome To Elmorr Api" });
});

app.use("/user", userCont)
app.use("/post", postCont)
app.use("/auth", auth);
app.use("/comment",commentCont)

app.all("/*dummy", (req, res) => {
  res.status(404).json({ messege: "invaild" });
});

app.use(globalErrorHandling)