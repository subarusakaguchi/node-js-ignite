import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "@errors/AppError";
import { UserRepository } from "@modules/accounts/repositories/implementations/UserRepository";

interface IPayloadToken {
    sub: string;
}

export async function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authToken = req.headers.authorization;

    if (!authToken) {
        throw new AppError("Token is missing!", 401);
    }

    const [, token] = authToken.split(" ");

    try {
        const { sub: user_id } = verify(
            token,
            "1825f88495687c598740ef37ee167721"
        ) as IPayloadToken;

        const userRepository = new UserRepository();

        const user = await userRepository.findById(user_id);

        if (!user) {
            throw new AppError("User does not Exists!", 401);
        }

        req.user = {
            id: user_id,
        };

        next();
    } catch {
        throw new AppError("Token is invalid!", 401);
    }
}
