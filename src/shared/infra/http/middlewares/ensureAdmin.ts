import { NextFunction, Request, Response } from "express";

import { UserRepository } from "@modules/accounts/infra/typeorm/repositories/UserRepository";
import { AppError } from "@shared/errors/AppError";

export async function ensureAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;

  const usersRepository = new UserRepository();

  const userExists = await usersRepository.findById(id);

  if (!userExists) {
    throw new AppError("User does not exists");
  }

  if (!userExists.isAdmin) {
    throw new AppError("User is not an Admin");
  }

  return next();
}
