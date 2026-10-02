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
import { randomUUID } from "node:crypto";
import { exists, set } from "../common/services/cach.service.js";

export const userBaseKey = ({UserID}) => {
  return `UserID::${UserID.toString()}`;
};

export const userBaseRevokeTokenKey = ({UserID}) => {
  return `${userBaseKey ({UserID})}::revoke token`;
};

export const userRevokeTokenKey = ({UserID, jti}) => {
  return `${userBaseRevokeTokenKey({UserID})}::token::${jti}`;
};

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

  if (!payload.sub) {
    throw badReqException("thats shit missing payload");
  }

  if (await exists({ key: userRevokeTokenKey({UserID: payload.sub,jti : payload.jti}) })) {
    throw unauthorizedException("logged out");
  }

  const user = await findById({
    model: UserModel,
    id: payload.sub,
  });
  if (!user) {
    throw notFoundException("not foun user");
  }

  console.log({change : user.changeCredentialsTime?.getTime() , iat : payload.iat*1000})

   if ((user.changeCredentialsTime?.getTime() ?? 0) > payload.iat*1000) {
    throw unauthorizedException("logged out biiii")
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

export const creatLoginCridintials = async ({ user, options = {}, issuer }) => {
  const { access, refresh } = await gettokensignature({ role: user.role });
  const jwtid = randomUUID();
  const accessToken = await createToken({
    payload: { sub: user._id, role: user.role },

    options: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: ACCESS_TOKEN_EXP,
      jwtid,
    },
    secret: access,
  });
  const refreshToken = await createToken({
    payload: { sub: user._id, role: user.role },

    options: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: REFRESH_TOKEN_EXP,
      jwtid,
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

export const creatRevokeToken = async ({payload}) => {
  const accessToken = ACCESS_TOKEN_EXP;
  const consumetTime = Math.ceil(Date.now() / 1000) - payload.iat;
  const refreshexpiresin = payload.iat + REFRESH_TOKEN_EXP;
  const ttl = refreshexpiresin - consumetTime;
  console.log({ payload, consumetTime, refreshexpiresin, ttl, accessToken });

  await set({
    key: userRevokeTokenKey({UserID: payload.sub,jti : payload.jti}),
    value: payload.jti,
    ttl,
  });
};
