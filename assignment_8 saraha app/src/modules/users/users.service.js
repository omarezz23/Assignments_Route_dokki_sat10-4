import { UserModel } from "../../database/models/user.model.js";
import { encrypt } from "../../security/encryption.js";

export const updateUser = async (id, input) => {
  const { name, email, phone, age } = input;

  if (email) {
    const exists = await UserModel.findOne({
      email,
      _id: id,
    });

    if (exists) {
      throw new Error("Email already exists");
    }
  }
  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      $set: { name, email, phone: await encrypt(phone), age },
      $inc: { __v: 1 },
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const deleteUser = async (id) => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  await UserModel.findByIdAndDelete(id);

  return user;
};

export const getUser = async (id) => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
