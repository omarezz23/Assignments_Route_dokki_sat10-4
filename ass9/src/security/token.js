import pkg from "jsonwebtoken";
const { sign, verify, decode } = pkg;
import jwt from "jsonwebtoken";
import {
  ACCESS_ADMIN_TOKEN_SIGN,
  ACCESS_TOKEN_EXP,
  ACCESS_TOKEN_SIGN,
  ACCESS_USER_TOKEN_SIGN,
  REFRESH_ADMIN_TOKEN_SIGN,
  REFRESH_TOKEN_EXP,
  REFRESH_TOKEN_SIGN,
  REFRESH_USER_TOKEN_SIGN,
} from "../config/config.js";
import {
  badReqException,
  notFoundException,
  unauthorizedException,
} from "../common/errors/error.exception.js";
import { findById, findOne } from "../common/repository/repo.js";
import { UserModel } from "../database/models/user.model.js";
import { TokenEnum } from "../common/enum/security.enum.js";
import { roleEnum } from "../common/enum/role.enum.js";
import { compare } from "./hashing.js";

export const createToken = async ({
  payload = {},
  options = {},
  secret = ACCESS_TOKEN_SIGN,
} = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({
  token = "",
  secret = ACCESS_TOKEN_SIGN,
} = {}) => {
  return jwt.verify(token, secret);
};

const getsignature = async ({
  tokenType = TokenEnum.ACCESS,
  role = roleEnum.USER,
} = {}) => {
  const signatures = await gettokensignature({ role });
  return tokenType === TokenEnum.ACCESS
    ? signatures.access
    : signatures.refresh;
};

export const decodeToken = async ({
  authorization = "",
  tokenType = TokenEnum.ACCESS,
} = {}) => {
  const decoded = jwt.decode(authorization);
  console.log(decoded);
  if (!decoded?.aud?.length) {
    throw badReqException("thats shit missing payload");
  }

  const payload = await verifyToken({
    token: authorization,
    secret: await getsignature({ tokenType, role: decoded.aud[0] }),
  });

  if (!payload) {
    throw badReqException("thats shit missing payload");
  }
  const user = await findById({
    model: UserModel,
    id: payload.sub,
  });
  if (!user) {
    throw notFoundException("not foun user");
  }
  return { user, payload };
};

const gettokensignature = async ({ role = roleEnum.USER } = {}) => {
  let signature;
  switch (role) {
    case roleEnum.ADMIN:
      signature = {
        access: ACCESS_ADMIN_TOKEN_SIGN,
        refresh: REFRESH_ADMIN_TOKEN_SIGN,
      };
      break;
    default:
      signature = {
        access: ACCESS_USER_TOKEN_SIGN,
        refresh: REFRESH_USER_TOKEN_SIGN,
      };
      break;
  }
  return signature;
};

export const creatLoginCridintials = async ({ user, options = {} }) => {
  const { access, refresh } = await gettokensignature({ role: user.role });
  const accessToken = await createToken({
    payload: { sub: user._id, role: user.role },
    options: {
      ...options,

      audience: [user.role],
      expiresIn: ACCESS_TOKEN_EXP,
    },
    secret: access,
  });
  const refreshToken = await createToken({
    payload: { sub: user._id, role: user.role },
    options: {
      ...options,

      audience: [user.role],
      expiresIn: REFRESH_TOKEN_EXP,
    },
    secret: refresh,
  });
  console.log({ role: user.role, access, refresh });
  return { accessToken, refreshToken };
};

export const basicAuth = async ({ email, password }) => {
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

  return user;
};
