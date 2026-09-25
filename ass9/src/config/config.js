import  dotenv  from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
export const DB_NAME = process.env.DB_NAME;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const ENCRYPTION_IV_LENGTH = parseInt(process.env.ENCRYPTION_IV_LENGTH ?? "16")
//export const ENCRYPTION_IV_LENGTH = process.env.ENCRYPTION_IV_LENGTH
export const ACCESS_TOKEN_SIGN =process.env.ACCESS_TOKEN_SIGN
export const REFRESH_TOKEN_SIGN =process.env.REFRESH_TOKEN_SIGN
export const ACCESS_TOKEN_EXP =process.env.ACCESS_TOKEN_EXP
export const REFRESH_TOKEN_EXP =process.env.REFRESH_TOKEN_EXP

export const REFRESH_ADMIN_TOKEN_SIGN =process.env.REFRESH_ADMIN_TOKEN_SIGN
export const REFRESH_USER_TOKEN_SIGN =process.env.REFRESH_USER_TOKEN_SIGN
export const ACCESS_ADMIN_TOKEN_SIGN =process.env.ACCESS_ADMIN_TOKEN_SIGN
export const ACCESS_USER_TOKEN_SIGN =process.env.ACCESS_USER_TOKEN_SIGN


export const WEB_CLIENT_ID = process.env.WEB_CLIENT_ID