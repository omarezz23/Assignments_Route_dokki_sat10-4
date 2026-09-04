import { UserModel } from "../../database/models/user.model.js";

export const signup = async (input) => {
  const existingUser = await UserModel.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const user = new UserModel(input);

  await user.save();

  return user;
};

export const login = async (input) => {
  const { email, password } = input;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.password !== password) {
    throw new Error("Invalid email or password");
  }

  return user;
};

// export const signup = async (input) => {
//   //const user = await UserModel.insertOne(input)
//   const { name, email, password } = (input);

//    if (!name || !email || !password) {
//     throw new Error("All fields are required");
//   }

//   const existingUser = await UserModel.findOne({
//     email,
//   });
//   if (existingUser) {
//         return {
//             status: 409,
//             message: "Email already exists"
//         };
//     }

//   const user = await UserModel.insertOne({
//     name,
//     email,
//     password,
//     createdAt: new Date(),
//   });

//  return user
// };

// export const login = async ({ email, password }) => {

//   const user = await UserModel.findOne({
//     email,
//   });

//   if (!user) {
//     return {
//       status: 401,
//       message: "Invalid email or password",
//     };
//   }

//   if (user.password !== password) {
//     return {
//       status: 401,
//       message: "Invalid email or password",
//     };
//   }

//   return {
//     status: 200,
//     message: "Login successful",
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     },
//   };
// };

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
