import  dotenv  from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
export const DB_NAME = process.env.DB_NAME;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const ENCRYPTION_IV_LENGTH = parseInt(process.env.ENCRYPTION_IV_LENGTH ?? "16")
//export const ENCRYPTION_IV_LENGTH = process.env.ENCRYPTION_IV_LENGTH
