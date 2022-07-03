import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";

import { IUserRepository } from "@modules/accounts/repositories/IUserRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgottenEmailPasswordUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("EtheralMailProvider")
    private mailProvider: IMailProvider
  ) {}
  async execute(email: string): Promise<void> {
    const hoursToExpire = 3;
    const userExists = await this.userRepository.findByEmail(email);

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "forgotPassword.hbs"
    );

    if (!userExists) {
      throw new AppError("User does not exists", 404);
    }

    const token = uuidv4();

    const expires_date = this.dateProvider.addHours(hoursToExpire);

    await this.userTokensRepository.create({
      refresh_token: token,
      user_id: userExists.id,
      expires_date,
    });

    const variables = {
      name: userExists.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`,
    };

    await this.mailProvider.sendMail({
      to: email,
      subject: "Recuperação de senha: RENTX",
      variables,
      path: templatePath,
    });
  }
}

export { SendForgottenEmailPasswordUseCase };
