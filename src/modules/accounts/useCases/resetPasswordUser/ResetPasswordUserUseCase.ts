import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { IUserRepository } from "@modules/accounts/repositories/IUserRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IResetPasswordUserUseCaseRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute({ token, password }: IResetPasswordUserUseCaseRequest) {
    const tokenExists = await this.userTokensRepository.findByRefreshToken(
      token
    );

    if (!tokenExists) {
      throw new AppError("Token is Invalid!");
    }

    const dateNow = this.dateProvider.dateNow();

    const isBefore = this.dateProvider.compareIsBefore(
      tokenExists.expires_date,
      dateNow
    );

    if (isBefore) {
      throw new AppError("Token is expired!");
    }

    const user = await this.userRepository.findById(tokenExists.user_id);

    if (!user) {
      throw new AppError("User not found!");
    }

    const hashNewPassword = await hash(password, 8);

    user.password = hashNewPassword;

    await this.userRepository.create(user);

    await this.userTokensRepository.deleteById(tokenExists.id);
  }
}

export { ResetPasswordUserUseCase };
