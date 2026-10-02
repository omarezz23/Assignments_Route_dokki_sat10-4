import { findById, findByIdAndUpdate } from "../../common/repository/repo.js";
import { UserModel } from "../../database/models/user.model.js";
import { encrypt } from "../../security/encryption.js";
import jwt from "jsonwebtoken";
import {
  createToken,
  creatLoginCridintials,
  creatRevokeToken,
  userBaseRevokeTokenKey,
  userRevokeTokenKey,
  verifyToken,
} from "../../security/token.js";
import {
  ACCESS_TOKEN_EXP,
  ACCESS_TOKEN_SIGN,
  REFRESH_TOKEN_EXP,
  REFRESH_TOKEN_SIGN,
} from "../../config/config.js";
import { DATE } from "sequelize";
import { conflictException } from "../../common/errors/error.exception.js";
import { del, keys, set } from "../../common/services/cach.service.js";
import { LogoutEnum } from "../../common/enum/security.enum.js";

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

export const rotate = async (payload, user, issuer) => {
  const accessexpiresin = (payload.iat + ACCESS_TOKEN_EXP) * 1000;
  const currentTime = Date.now() + 30000 * 60000;
  // if (currentTime < accessexpiresin) {
  //   throw conflictException ("sorry thats not valid baby")
  // }
  const data = await creatLoginCridintials({ user, issuer });
  await creatRevokeToken({ payload });
  return data;
  //return { payload, accessexpiresin, currentTime, user };
};

export const logout = async (payload, user, { action = LogoutEnum.DEVICE }) => {
  console.log({user})
  switch (action) {
    case LogoutEnum.ALL:
      user.changeCredentialsTime = new Date ()
      await user.save()
      console.log({ keys: await keys ({prefix : userBaseRevokeTokenKey({UserID : payload.sub})})})
      await del({key : await keys ({prefix : userBaseRevokeTokenKey({UserID : payload.sub})})})
      break; 

    default:
      await creatRevokeToken({ payload });
      break;
  }
  return;
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
