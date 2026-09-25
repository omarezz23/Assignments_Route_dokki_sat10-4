import { findById, findByIdAndUpdate } from "../../common/repository/repo.js";
import { UserModel } from "../../database/models/user.model.js";
import { encrypt } from "../../security/encryption.js";
import jwt from "jsonwebtoken";
import { createToken, creatLoginCridintials, verifyToken } from "../../security/token.js";
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP, REFRESH_TOKEN_SIGN } from "../../config/config.js";
import { DATE } from "sequelize";
import { conflictException } from "../../common/errors/error.exception.js";

export const profile = async (acc) => {
  return acc;
};

export const updateprofile = async (user, data) => {
  const account = await findByIdAndUpdate({
    model: UserModel,
    id: user._id,
    update: data,
  });
  return account;
};

export const rotate = async (payload,user) => {
  const accessexpiresin = (payload.iat + ACCESS_TOKEN_EXP) * 1000;
  const currentTime = Date.now() + (30000 * 60000);
  // if (currentTime < accessexpiresin) {
  //   throw conflictException ("sorry thats not valid baby")
  // }
return await creatLoginCridintials({user})
  //return { payload, accessexpiresin, currentTime, user };
};

/////////////////////////////////////////////////////////////////////////////////////////////
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
      returnDocument: "after",
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
