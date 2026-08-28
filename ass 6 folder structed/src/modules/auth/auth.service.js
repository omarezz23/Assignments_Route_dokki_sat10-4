import {db} from "../../database/db.js";
import { UserModel } from "../../database/model/user.model.js";

export const signup = async (input) => {
  const user = await UserModel.insertOne(input)
  return user
}








// export const signup = async (input) => {
//   const { username, email, password } = input;
//   const [firstName, middleName, lastName] = username.split(" ");

//   const [user] = await db.query("SELECT * FROM users WHERE u_email = ?", [
//     email,
//   ]);
//   if (user.length > 0) {
//     const error = new Error("Email already exists");
//     error.status = 400;
//     throw error;
//   }
//   const query = `INSERT INTO users (u_first_name,u_middle_name,u_last_name,u_email,u_password) VALUES (?, ?, ?, ?, ?)`;
//   const [result] = await db.execute(query, [
//     firstName,
//     middleName,
//     lastName,
//     email,
//     password,
//   ]);
//   return {user,result}
// };

// export const login = async (input) => {
//   const { email, password } = input;
//   const [user] = await db.query(
//     "SELECT * FROM users WHERE u_email = ? AND u_password = ?",
//     [email, password],
//   );

//  if (user.length === 0) {
//     const error = new Error("invalid credentials");
//     error.status = 401;
//     throw error;
// }

// return user
// };
