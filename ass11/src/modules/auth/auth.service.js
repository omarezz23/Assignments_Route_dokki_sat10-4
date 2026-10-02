import {
  badReqException,
  conflictException,
  notFoundException,
  unauthorizedException,
} from "../../common/errors/index.js";
import { UserModel } from "../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { compare, hash } from "../../security/hashing.js";
import { decrypt, encrypt } from "../../security/encryption.js";
import { create, findOne } from "../../common/repository/repo.js";
import jwt from "jsonwebtoken";
import { createToken, creatLoginCridintials } from "../../security/token.js";
import {
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
  REFRESH_TOKEN_SIGN,
  WEB_CLIENT_ID,
} from "../../config/config.js";
import { OAuth2Client } from "google-auth-library";
import { providerEnum } from "../../common/enum/role.enum.js";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//login with gmail
/* payload: {
    iss: 'https://accounts.google.com',
    azp: '590894984480-j76rg81ta5cng28ugt89suvfr7j9t0bp.apps.googleusercontent.com',
    aud: '590894984480-j76rg81ta5cng28ugt89suvfr7j9t0bp.apps.googleusercontent.com',
    sub: '104700760014729172559',
    email: 'osaber342@gmail.com',
    email_verified: true,
    nonce: 'not_provided',
    nbf: 1790269401,
    name: 'Omar Saber',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocLfC2dVLtgnkVEohTDv5GrFFQM2t74NEYdjiGpip9DGql6oOEqT=s96-c',
    given_name: 'Omar',
    family_name: 'Saber',
    iat: 1790269701,
    exp: 1790273301,
    jti: '22479dc6fef79e28c443c958538f1315ad923408'
  }
}
 */

const client = new OAuth2Client();
async function verifygoogleacc(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) {
    throw badReqException("not verevied");
  }
  return payload;
}

export const signupWithGmail = async ({ idToken }) => {
  console.log({ idToken });
  const { name, email, picture } = await verifygoogleacc(idToken);
  //console.log({ name, email, picture });

  const existingUser = await findOne({
    filter: { email },
    model: UserModel,
  });
  // console.log("3 - existingUser:", existingUser);
  if (existingUser) {
    if (existingUser.provider != providerEnum.GOOGLE) {
      throw conflictException("Email already exists");
    }
    console.log("BEFORE LOGIN CREDENTIALS");
    console.log("providerEnum.GOOGLE:", providerEnum.GOOGLE);
    console.log("existingUser.provider:", existingUser.provider);
    console.log("EXISTING USER:", existingUser);
    return await creatLoginCridintials({ user: existingUser });
  }
  console.log("DATA BEFORE CREATE:", {
    fullName: name,
    email,
    provider: providerEnum.GOOGLE,
    image: picture,
  });
  const user = await create({
    model: UserModel,
    data: {
      fullName: name,
      email,
      provider: providerEnum.GOOGLE,
      image: picture,
    },
  });
  // console.log("AFTER CREATE");
  // console.log("user:", user);
  const credentials = await creatLoginCridintials({ user });
  console.log("5 - credentials:", credentials);
  return credentials;
};

// export const loginWithGmail = async (account) => {

//   return await creatLoginCridintials({ user: account });
// };
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const signup = async ({
  fullName,
  email,
  password,
  phone,
  dob,
  confirmEmail,
  image,
  coverImage,
  role,
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
      role,
    },
    model: UserModel,
  });
  return user;
};

export const login = async ({ email, password }, issuer) => {
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

  return await creatLoginCridintials({ user: user , issuer});

  // user.phone = await decrypt(user.phone);
  // return user;
  //   const accessToken = await createToken({
  //     payload: {
  //       sub: user._id,
  //       extra: {
  //         email: user.email,
  //         fullName: user.fullName,
  //       },
  //     },
  //     options: {
  //       expiresIn: ACCESS_TOKEN_EXP,
  //     },
  //   });
  // const refreshToken = await createToken({
  //   payload: {
  //     sub: user._id,
  //     extra: {
  //       email: user.email,
  //       fullName: user.fullName,
  //     },
  //   },
  //   options: {
  //     expiresIn: REFRESH_TOKEN_EXP,
  //   },
  //   secret: REFRESH_TOKEN_SIGN,
  // });
  //   return {accessToken, refreshToken} ;
};
