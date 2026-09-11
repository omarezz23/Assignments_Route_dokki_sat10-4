import crypto, { Cipheriv } from "crypto";
import { ENCRYPTION_IV_LENGTH, ENCRYPTION_KEY } from "../config/config.js";

const algorithm = "aes-256-cbc";
const key = ENCRYPTION_KEY;
const iv = crypto.randomBytes(ENCRYPTION_IV_LENGTH);

export const encrypt = async (plaintext) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptData = cipher.update(plaintext, "utf-8", "hex");
  encryptData += cipher.final("hex");
  console.log({ iv, cipher, encryptData });
  return `${iv.toString("hex")}::${encryptData}`;
};

export const decrypt = async (cipherText) => {
  const [iv, encryptData] = cipherText.split("::");
  console.log({ iv, encryptData });
  const iv_vector = Buffer.from(iv, "hex");
  console.log({ iv_vector });
  const decipherVector = crypto.createDecipheriv(algorithm, key, iv_vector);
  let plainText = decipherVector.update(encryptData, "hex", "utf-8");
  plainText += decipherVector.final("utf-8");
  return plainText;
};


