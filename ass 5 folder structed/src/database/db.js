import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("ass_5", "root", "", {
  port: 3306,
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
  },
});

export const db = async () => {
  try {
    await sequelize.authenticate();
    
    console.log("db connected mf");

  } catch (error) {
    console.log("did not mf");
  }
};



// import { createPool } from "mysql2/promise";

// const db = createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "C",
// });

// async function connectDB() {
//   try {
//     await db.query("SELECT 1");
//     console.log("Connected to MySQL");
//   } catch (err) {
//     console.log("Database connection failed");
//     console.log(err);
//   }
// }
// connectDB();

//export default db;
