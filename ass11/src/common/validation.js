import { z } from "zod";
import { GenderEnum } from "./enum/enum.gender.js";
import { LangEnum } from "./enum/security.enum.js";

const nameValidationMessage = {
  102: {
    ar: "الاسم يجب أن يكون بين 3 و 30 حرفًا",
    en: "Name must be between 3 and 30 characters",
  },
};

const getvalidationMessage = (lang, code) => {
  return lang == LangEnum.AR
    ? nameValidationMessage[code].ar
    : nameValidationMessage[code].en;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const matchfeilds = (original, copy, data, ctx , lang) => {
  if (data[original] !== data[copy]) {
    ctx.addIssue({
      code: "custom",
      path: [copy],
      message: LangEnum.AR ? "فشل التطابق بين الحقول" : "Fields do not match",
    });
  }
};

export const generalValidationFields = {
  email:(lang) =>  z.email(),
  password: (lang) => z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:"pass must contain one upper char and one special char"}).min(8).max(16),
  fullName: (lang) =>
    z
      .string()
      .min(3, {
        message: getvalidationMessage(lang, 102),
      })
      .max(30),
  confirmpassword:(lang) => z.string().min(8).max(16),
  phone:(lang) =>  z.e164().optional(),
  gender: (lang) => z.enum(GenderEnum),
};
