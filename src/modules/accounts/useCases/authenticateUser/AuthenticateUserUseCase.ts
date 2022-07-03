import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

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
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({
    email,
    password,
  }: IRequestAuthenticateUserUseCase): Promise<IResponseAuthenticateUserUseCase> {
    const {
      secret_token,
      secret_refresh_token,
      expires_in_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = auth;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or Password incorrect!");
    }

    const passwordVerification = await compare(password, user.password);

    if (!passwordVerification) {
      throw new AppError("Email or Password incorrect!");
    }

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token,
    });

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_in_refresh_token,
    });

    const expires_date = this.dateProvider.addDays(expires_refresh_token_days);

    await this.userTokensRepository.create({
      expires_date,
      user_id: user.id,
      refresh_token,
    });

    const tokenReturn: IResponseAuthenticateUserUseCase = {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refresh_token,
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase, IResponseAuthenticateUserUseCase };
