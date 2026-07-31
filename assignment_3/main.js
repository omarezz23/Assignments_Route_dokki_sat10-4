const { app, server } = require("./server/server");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "json", "users.json");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///1
app.post("/user", (req, res) => {
  const newUser = req.body;
  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const userExists = users.find((user) => user.email === newUser.email);

  if (userExists) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  res.status(201).json({
    message: "User added successfully",
    user: newUser,
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///2
app.patch("/user/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = req.body;
  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  if (updatedData.email) {
    const emailExists = users.find(
      (u) => u.email === updatedData.email && u.id !== id,
    );

    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
  }
  if (updatedData.name) user.name = updatedData.name;
  if (updatedData.age) user.age = updatedData.age;
  if (updatedData.email) user.email = updatedData.email;
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  res.status(200).json({
    message: "User updated successfully",
    user,
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///3
app.delete("/user/:id", (req, res) => {
  const id = Number(req.params.id);
  let users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const newUsers = users.filter((user) => user.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(newUsers, null, 2));
  res.json({
    message: "User deleted successfully",
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///4
app.get("/user/getByName", (req, res) => {
  const name = req.query.name;
  let users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const user = users.find((u) => u.name === name);
  if (!user) {
    return res.send("User not found");
  }
  res.json(user);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///5
app.get("/user", (req, res) => {
  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(users);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///6
app.get("/user/filter", (req, res) => {
  const age = Number(req.query.age);
  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const result = users.filter((user) => user.age >= age);
  res.json(result);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///7
app.get("/user/:id", (req, res) => {
  const id = Number(req.params.id);
  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.json(user);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.all("/*dummy", (req, res) => {
  res.status(404).json({ messege: "invaild" });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////