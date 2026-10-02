import bcrypt from "bcrypt";

export const hash = async (plainText, Rounds = 12, minor="b" ) => {
    const salt = (await bcrypt.genSalt(Rounds, minor)).toString();
  return await bcrypt.hash(plainText, salt);
};

export const compare = async (plainText, hashed) => {
  return await bcrypt.compare(plainText, hashed);
}