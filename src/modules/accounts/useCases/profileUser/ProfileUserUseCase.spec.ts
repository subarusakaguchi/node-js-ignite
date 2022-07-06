import { UserRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";

import { ProfileUserUseCase } from "./ProfileUserUseCase";

let profileUserUseCase: ProfileUserUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;

describe("Get User Profile", () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    profileUserUseCase = new ProfileUserUseCase(userRepositoryInMemory);
  });
  it("Should be able to get an specific user profile", async () => {
    await userRepositoryInMemory.create({
      name: "Eugenia Scott",
      email: "gevejides@ripew.it",
      driver_license: "yaFm27fy9v",
      password: "12345",
    });

    await userRepositoryInMemory.create({
      name: "Augusta Fleming",
      email: "luvigji@loj.yt",
      driver_license: "nJISFu8GzS",
      password: "123456",
    });

    const userForTest = await userRepositoryInMemory.findByEmail(
      "luvigji@loj.yt"
    );

    const userFromUseCase = await profileUserUseCase.execute(userForTest.id);

    console.log(userForTest);

    expect(userFromUseCase).toEqual(userForTest);
  });
});
