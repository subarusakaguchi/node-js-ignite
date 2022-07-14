import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import * as redis from "redis";

import { AppError } from "@shared/errors/AppError";

const redisClient = redis.createClient({ enable_offline_queue: false });

redisClient.on("error", (err) => {
  throw new AppError(`Redis client error: ${err}`);
});

const opts = {
  storeClient: redisClient,
  points: 10,
  duration: 5,

  execEvenly: false,
  blockDuration: 0,
  keyPrefix: "rateLimiter",
};

const rateLimiterRedis = new RateLimiterRedis(opts);

export default async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await rateLimiterRedis.consume(req.ip);

    return next();
  } catch (err) {
    throw new AppError("Too many requests", 429);
  }
}
