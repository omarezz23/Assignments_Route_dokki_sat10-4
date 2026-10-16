import { email, z } from "zod";
import { generalValidationFields } from "../../common/validation.js";
import mongoose, { Query } from "mongoose";

export const createMessage = (lang) => {
  return z
    .object({
      body: z.strictObject({
        content: z
          .string()
          .max(10000, { message: "content must be less than 10000 characters" })
          .optional(),
        receiverID: generalValidationFields.id(lang),
      }),
      files: z.array(generalValidationFields.file(lang)).optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.body.content && !data.files?.length) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message: "missing data, either content or files must be provided",
        });
      }
    });
};

export const allMessage = (lang) => {
  return z.object({
    query: z.strictObject({
      type: z.enum(["0", "1", "2"]).default("0"),
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(5),
    }),
  });
};

export const deleteM = (lang) => {
  return z.object({
    params: z.strictObject({
      messageId: generalValidationFields.id(lang),
    }),
  });
};
