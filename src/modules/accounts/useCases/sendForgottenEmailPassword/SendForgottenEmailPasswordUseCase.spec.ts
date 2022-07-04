import { UserRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { UserTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { EtheralMailProviderInMemory } from "@shared/container/providers/MailProvider/In-memory/EtheralMailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgottenEmailPasswordUseCase } from "./SendForgottenEmailPasswordUseCase";

let sendForgottenEmailPasswordUseCase: SendForgottenEmailPasswordUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;
let userTokensRepositoryInMemory: UserTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let etherealMailProvider: EtheralMailProviderInMemory;

describe("Send Forgotten Password Mail", () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    userTokensRepositoryInMemory = new UserTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    etherealMailProvider = new EtheralMailProviderInMemory();
    sendForgottenEmailPasswordUseCase = new SendForgottenEmailPasswordUseCase(
      userRepositoryInMemory,
      userTokensRepositoryInMemory,
      dateProvider,
      etherealMailProvider
    );
  });
  it("Should be able to send a reset password email to an existing user", async () => {
    const sendMail = jest.spyOn(etherealMailProvider, "sendMail");

    await userRepositoryInMemory.create({
      driver_license: "01168356",
      email: "ap@vuscoj.am",
      name: "Clyde Ray",
      password: "12345",
    });

    await sendForgottenEmailPasswordUseCase.execute("ap@vuscoj.am");

    expect(sendMail).toHaveBeenCalled();
  });

  it("Should not be able to send an email if the user does not exists", async () => {
    expect(async () => {
      await sendForgottenEmailPasswordUseCase.execute("milub@pem.io");
    }).rejects.toEqual(new AppError("User does not exists", 404));
  });

  it("Should be able to create an users token", async () => {
    const generateTokenMail = jest.spyOn(
      userTokensRepositoryInMemory,
      "create"
    );

    await userRepositoryInMemory.create({
      driver_license: "85455070",
      email: "fapez@tirese.uk",
      name: "Ronnie Hines",
      password: "54321",
    });

    await sendForgottenEmailPasswordUseCase.execute("fapez@tirese.uk");

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
