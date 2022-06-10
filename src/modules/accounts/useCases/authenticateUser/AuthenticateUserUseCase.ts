import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@src/shared/errors/AppError";

import { IUserRepository } from "../../repositories/IUserRepository";

interface IRequestAuthenticateUserUseCase {
    email: string;
    password: string;
}

interface IResponseAuthenticateUserUseCase {
    user: {
        name: string;
        email: string;
    };
    token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UserRepository")
        private userRepository: IUserRepository
    ) {}

    async execute({
        email,
        password,
    }: IRequestAuthenticateUserUseCase): Promise<IResponseAuthenticateUserUseCase> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Email or Password incorrect!");
        }

        const passwordVerification = await compare(password, user.password);

        if (!passwordVerification) {
            throw new AppError("Email or Password incorrect!");
        }

        const token = sign({}, "1825f88495687c598740ef37ee167721", {
            subject: user.id,
            expiresIn: "1 day",
        });

        const tokenReturn: IResponseAuthenticateUserUseCase = {
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase, IResponseAuthenticateUserUseCase };
