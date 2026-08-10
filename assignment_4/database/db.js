const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "store",
});

async function connectDB() {
  try {
    await db.query("SELECT 1");
    console.log("Connected to MySQL");
  } catch (err) {
    console.log("Database connection failed");
    console.log(err);
  }
}
connectDB();

// let db
// async function connectDB() {
//   try {
//     db = await mysql.createConnection({
//       host: "localhost",
//       user: "root",
//       password: "",
//       database: "store",
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// connectDB();

module.exports = db;
