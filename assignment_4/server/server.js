const express = require("express");
const app = express();
require('dotenv').config();

let port =  process.env.PORT;

app.use(express.json());

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


module.exports = {
  app,
  server,
};
