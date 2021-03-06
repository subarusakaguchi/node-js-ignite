import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { AppError } from "@shared/errors/AppError";

interface IPayloadToken {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authToken = req.headers.authorization;

  const { secret_refresh_token } = auth;

  if (!authToken) {
    throw new AppError("Token is missing!", 401);
  }

  const [, token] = authToken.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      secret_refresh_token
    ) as IPayloadToken;

    req.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new AppError("Token is invalid!", 401);
  }
}
