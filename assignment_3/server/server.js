const express = require("express");
const app = express();
let port = 3000;

app.use(express.json());

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`),
);

module.exports = {
  app,
  server,
};
