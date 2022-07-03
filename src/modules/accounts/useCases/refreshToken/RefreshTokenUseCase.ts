import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}
  async execute(token: string): Promise<string> {
    const { secret_refresh_token, expires_refresh_token_days } = auth;
    const { sub, email } = verify(token, secret_refresh_token) as IPayload;

    const user_id = sub;

    const userTokenExists =
      await this.userTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      );

    if (!userTokenExists) {
      throw new AppError("Refresh token does not exists!");
    }

    await this.userTokensRepository.deleteById(userTokenExists.id);

    const newRefreshToken = sign({ email }, secret_refresh_token, {
      subject: user_id,
      expiresIn: expires_refresh_token_days,
    });

    const expires_date = this.dateProvider.addDays(expires_refresh_token_days);

    await this.userTokensRepository.create({
      user_id,
      refresh_token: newRefreshToken,
      expires_date,
    });

    return newRefreshToken;
  }
}

export { RefreshTokenUseCase };
