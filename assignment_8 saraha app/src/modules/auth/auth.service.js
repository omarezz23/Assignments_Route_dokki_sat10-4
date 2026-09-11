import {
  conflictException,
  notFoundException,
  unauthorizedException,
} from "../../common/errors/index.js";
import { UserModel } from "../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { compare, hash } from "../../security/hashing.js";
import { decrypt, encrypt } from "../../security/encryption.js";
import { create, findOne } from "../../common/repository/repo.js";

export const signup = async ({
  fullName,
  email,
  password,
  phone,
  dob,
  confirmEmail,
  image,
  coverImage,
}) => {
  const existingUser = await findOne({
    filter: { email },
    model: UserModel,
  });
  if (existingUser) {
    throw conflictException("Email already exists");
  }
  const user = await create({
    data: {
      fullName,
      email,
      password: await hash(password),
      phone: await encrypt(phone),
      dob,
      confirmEmail,
      image,
      coverImage,
    },
    model: UserModel,
  });
};

export const login = async (email, password) => {
  const user = await findOne({
    filter: { email },
    model: UserModel,
  });
  if (!user) {
    throw notFoundException("User not found");
  }
  const match = await compare(password, user.password);
  if (!match) {
    throw unauthorizedException("Invalid email or password");
  }
  user.phone = await decrypt(user.phone);
  return user;
};
