import { number } from "zod";
import { LangEnum } from "../common/enum/security.enum.js";
import { badReqException } from "../common/errors/error.exception.js";

export const validation = (Schema) => {
  return (req, res, next) => {
    const lang = Number(req.headers ['accept-language'] )
    console.log({lang})
    const validationResult = Schema(lang).safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
     // headers: req.headers,
    });
    console.log({ validationResult });
    if (!validationResult.success) {
      throw badReqException("validation error", validationResult.error.issues);
    }
    req.validate = validationResult.data;
    next();
  };
};
