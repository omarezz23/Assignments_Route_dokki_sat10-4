import { cast } from "sequelize";
import { TokenEnum } from "../common/enum/security.enum.js";
import { forbiddenException, unauthorizedException } from "../common/errors/error.exception.js";
import { basicAuth, decodeToken } from "../security/token.js";

export const authentication = (tokenType = TokenEnum.ACCESS) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      throw unauthorizedException("not valid");
    }
    const [key, credentials] = authorization.split(" ") || [];
    console.log({ key, credentials });

    switch (key) {
      case "Basic":
        const [email, password] = Buffer.from(credentials, "base64")
          .toString()
          ?.split(":");
        console.log({ email, password });
        req.user = await basicAuth({ email, password });
        break;
      case "Bearer":
        const { user, payload } = await decodeToken({
          authorization: credentials,
          tokenType,
        });
        req.user = user;
        req.payload = payload;
        break;
      default:
        next(new Error("invalid auth schema"));

        break;
    }

    next();
  };
};

export const authorization = (accessRole) => {
  return async (req, res, next) => {
    if (req.user.role < accessRole) {
      throw forbiddenException("forbidden account");
    }
    next();
  };
};
