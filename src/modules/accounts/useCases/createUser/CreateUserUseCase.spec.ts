import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../entities/User";
import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
    beforeEach(() => {
        userRepositoryInMemory = new UserRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    });
    it("Should be able to create an user", async () => {
        const user: ICreateUserDTO = {
            name: "Subaru Sakaguchi",
            email: "subarusakaguchi@yahoo.com.br",
            password: "123456",
            driver_license: "9s87da98d79asad",
        };

        await createUserUseCase.execute(user);

        const userCreatedByEmail = await userRepositoryInMemory.findByEmail(
            user.email
        );

        const userCreatedById = await userRepositoryInMemory.findById(
            userCreatedByEmail.id
        );

        expect(userCreatedByEmail).toBeDefined();
        expect(userCreatedByEmail).toHaveProperty("id");
        expect(userCreatedByEmail).toBeInstanceOf(User);

        expect(userCreatedById).toBeDefined();
        expect(userCreatedById).toHaveProperty("id");
        expect(userCreatedById).toBeInstanceOf(User);
    });
});
