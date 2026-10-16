import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import geoip from "geoip-lite";
import { client } from "../database/models/redis.connection.js";
import { decr, exists, incr } from "../common/services/cach.service.js";

async function fromWhere(ip) {
  try {
    return geoip.lookup(ip);
  } catch (error) {
    console.log("failtodetect");
    console.log(error);
  }
}

export const genrateRateLimit = ({
  ttl,
  legacyHeaders = true,
  standardHeaders = "draft-8",
  message,
  limit = 50,
  statusCode = 429,
  skipFailedRequests,
  skipSuccessfulRequests,
}) => {
  return rateLimit({
    windowMs: ttl * 60000,
    legacyHeaders,
    standardHeaders,
    skipFailedRequests,
    skipSuccessfulRequests,
    handler: function (req, res, next) {
      return res.status(statusCode).json({
        message: message || "Too many requests, please try again later.",
      });
    },

    limit: async function (req) {
      const country = await fromWhere(req.ip);
      console.log("IP:", req.ip);
      console.log("Country data:", country);

      return country?.country === "EG" ? limit : 0;
    },
    keyGenerator: function (req) {
      const ip = ipKeyGenerator(req.ip, 52);
      return `${req.ip}::${req.path}`;
    },
    store: {
      async incr(key, cb) {
        try {
          const count = await client.incr(key);
          if (count === 1) {
            await client.expire(key, 60);
          }
          cb(null, count);
        } catch (error) {
          cb(error);
        }
      },
      async decrement(key) {
        if (await exists(key)) {
          await client.decr(key);
        }
      },
    },
  });
};
