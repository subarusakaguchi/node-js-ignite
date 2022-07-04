import { verify } from "jsonwebtoken";

import { UserTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import {
  AuthenticateUserUseCase,
  IResponseAuthenticateUserUseCase,
} from "./AuthenticateUserUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let userTokensRepositoryInMemory: UserTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

const hash = "1825f88495687c598740ef37ee167721";

describe("Authenticate User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    userTokensRepositoryInMemory = new UserTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory,
      userTokensRepositoryInMemory,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });
  it("Should be able to Authenticate an Existing User", async () => {
    const user: ICreateUserDTO = {
      name: "Subaru Sakaguchi",
      email: "subarusakaguchi@yahoo.com.br",
      password: "123456",
      driver_license: "90022-291912",
    };

    await createUserUseCase.execute(user);

    const result: IResponseAuthenticateUserUseCase =
      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });

    expect(result).toHaveProperty("token");

    const isValid = verify(result.token, hash);

    expect(isValid).toBeTruthy();
  });

  it("Should not be able to authenticate a nonexisting user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@user.com",
        password: "123456",
      });
    }).rejects.toEqual(new AppError("Email or Password incorrect!"));
  });

  it("Should not be able to authenticate an existing user with the wrong password", async () => {
    const user = {
      name: "Subaru Sakaguchi",
      email: "subarusakaguchi@yahoo.com.br",
      password: "123456",
      driver_license: "90022-291912",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "12345",
      })
    ).rejects.toEqual(new AppError("Email or Password incorrect!"));
  });
});
