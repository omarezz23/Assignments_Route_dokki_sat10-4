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
import {
  createToken,
  creatLoginCridintials,
  userBaseRevokeTokenKey,
} from "../../security/token.js";
import {
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
  REFRESH_TOKEN_SIGN,
  WEB_CLIENT_ID,
} from "../../config/config.js";
import { OAuth2Client } from "google-auth-library";
import { providerEnum } from "../../common/enum/role.enum.js";
import { sendEmail } from "../../common/mail/send.email.js";
import {
  emailEvent,
  UserEmailKey,
  UserEmailTrialsKey,
} from "../../common/mail/email.event.js";
import { emailEnum } from "../../common/enum/email.enum.js";
import { createOtp } from "../../utils/otp.js";
import {
  del,
  expire,
  get,
  incby,
  keys,
  set,
  ttl,
} from "../../common/services/cach.service.js";
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
////////////////////////////////////////////////////////////
const sendEmailOTP = async ({
  email,
  subject,
  expiresIn = 120,
  maxTrials = 3,
  blockinsecs = 300,
  title = emailEnum.ConfirmEmail,
}) => {
  const otpttl = await ttl({ key: UserEmailKey({ email, subject }) });
  if (otpttl > 0) {
    throw badReqException(
      `Please wait ${otpttl} seconds before requesting a new OTP`,
    );
  }
  const oldTrials =
    (await get({ key: UserEmailTrialsKey(email, subject) })) ?? 0;
  if (oldTrials >= maxTrials) {
    throw badReqException(
      `You have exceeded the maximum number of OTP requests. Please try again later.`,
    );
  }
  const code = createOtp();
  await set({
    key: UserEmailKey({ email, subject }),
    value: await hash(code.toString()),
    ttl: expiresIn,
  });
  const currentTrials = await incby({
    key: UserEmailTrialsKey({ email, subject }),
    increment: 1,
  });
  if (currentTrials == 1) {
    await expire({
      key: UserEmailTrialsKey({ email, subject }),
      ttl: blockinsecs,
    });
  }
  emailEvent.emit("sendEmail", {
    recepiant: { to: email },
    subject,
    //subject: emailEnum.ConfirmEmail,
    data: { code, title: title ?? subject },
  });
  return;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const signup = async ({
  fullName,
  email,
  password,
  phone,
  dob,
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
      image,
      coverImage,
      role,
    },
    model: UserModel,
  });

  await sendEmailOTP({ email, subject: emailEnum.ConfirmEmail });
  // const code = createOtp();
  // await set({
  //   key: UserEmailKey({email , subject: emailEnum.ConfirmEmail}) ,
  //   value: await hash(code.toString()),
  //   ttl: 120,
  // });
  // emailEvent.emit("sendEmail", {
  //   recepiant: { to: email },
  //   subject: emailEnum.ConfirmEmail,
  //   data: { code},
  // });
  // await sendEmail({
  //   to: email,
  //   subject: "Welcome to our app",
  //   text: "Welcome to our app!",
  // });
  return user;
};
//////////////////////////////////////////////////////////////////////////
export const resendConfirmEmail = async ({ email }) => {
  const existingUser = await findOne({
    filter: {
      email,
      provider: providerEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
    model: UserModel,
  });
  if (existingUser) {
    throw conflictException("Email already exists");
  }
  await sendEmailOTP({ email, subject: emailEnum.ConfirmEmail });
  // return existingUser ;
};
///////////////////////////////////////////////////////////////////////////////////////////////
export const requestforgotPassword = async ({ email }) => {
  const existingUser = await findOne({
    filter: {
      email,
      provider: providerEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
    model: UserModel,
  });
  if (!existingUser) {
    throw conflictException("Email doesnt exists");
  }
  await sendEmailOTP({
    email,
    subject: emailEnum.ForgetPassword,
    title: emailEnum.ForgetPassword,
  });
  // return existingUser ;
};
//////////////////////////////////////////////////////////////////////////////////
export const veifyForgetPassword = async ({ otp, email }) => {
  const existingUser = await findOne({
    filter: {
      email,
      provider: providerEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
    model: UserModel,
  });
  if (!existingUser) {
    throw notFoundException("Email not found");
  }
  const hashOtp = await get({
    key: UserEmailKey({ email, subject: emailEnum.ForgetPassword }),
  });
  if (!hashOtp || !(await compare(otp.toString(), hashOtp))) {
    throw unauthorizedException("Invalid OTP");
  }
  return existingUser;
};
////////////////////////////////////////////////////
export const resetpass = async ({ otp, email, password }) => {
  const user = await veifyForgetPassword({ email, otp });
  user.password = await hash(password);
  user.changeCredentialsTime = new Date();
  await user.save();

  const result = await Promise.all([
    keys({ prefix: userBaseRevokeTokenKey({ UserID: user._id })}),
    keys({prefix: UserEmailKey({ email, subject: emailEnum.ForgetPassword })}),
  ]);
  await del({
    key: [...result[0], ...result[1]],
  });
  return { message: "password resetted successfully" };
};
////////////////////////////////////////////////////////////////////////////////////////////
export const login = async ({ email, password }, issuer) => {
  const user = await findOne({
    filter: {
      email,
      provider: providerEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
    model: UserModel,
  });
  if (!user) {
    throw notFoundException("User not found");
  }
  const match = await compare(password, user.password);
  if (!match) {
    throw unauthorizedException("Invalid email or password");
  }

  return await creatLoginCridintials({ user: user, issuer });

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
///////////////////////////////////////////////////////////////////////
export const confirmEmail = async ({ otp, email }) => {
  const existingUser = await findOne({
    filter: {
      email,
      provider: providerEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
    model: UserModel,
  });
  if (!existingUser) {
    throw notFoundException("Email not found");
  }
  const hashOtp = await get({
    key: UserEmailKey({ email, subject: emailEnum.ConfirmEmail }),
  });
  if (!hashOtp || !(await compare(otp.toString(), hashOtp))) {
    throw unauthorizedException("Invalid OTP");
  }
  existingUser.confirmEmail = new Date();
  await existingUser.save();
  await del({
    key: await keys({
      prefix: UserEmailKey({ email, subject: emailEnum.ConfirmEmail }),
    }),
  });

  // await del({ key: UserEmailKey({ email, subject: emailEnum.ConfirmEmail }) });
  return { message: "Email confirmed successfully" };
};
