import { verify } from "jsonwebtoken";

import { AppError } from "@shared/errors/AppError";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import {
  AuthenticateUserUseCase,
  IResponseAuthenticateUserUseCase,
} from "./AuthenticateUserUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

const hash = "1825f88495687c598740ef37ee167721";

describe("Authenticate User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory
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
  it("Should not be able to authenticate a nonexisting user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@user.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  it("Should not be able to authenticate an existing user with the wrong password", () => {
    expect(async () => {
      const user = {
        name: "Subaru Sakaguchi",
        email: "subarusakaguchi@yahoo.com.br",
        password: "123456",
        driver_license: "90022-291912",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "12345",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
