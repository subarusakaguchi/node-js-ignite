import { User } from "../../entities/User";
import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
    beforeAll(() => {
        userRepositoryInMemory = new UserRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    });
    it("Should be able to create an user", async () => {
        const user = {
            name: "Subaru Sakaguchi",
            email: "subarusakaguchi@yahoo.com.br",
            password: "123456",
            driver_license: "9s87da98d79asad",
        };

        await createUserUseCase.execute(user);

        const userCreatedByEmail = await userRepositoryInMemory.findByEmail(
            user.email
        );

        console.log(userCreatedByEmail);

        const userCreatedById = await userRepositoryInMemory.findById(
            userCreatedByEmail.id
        );

        console.log(userCreatedById);

        expect(userCreatedByEmail).toBeDefined();
        expect(userCreatedByEmail).toHaveProperty("id");
        expect(userCreatedByEmail).toBeInstanceOf(User);

        expect(userCreatedById).toBeDefined();
        expect(userCreatedById).toHaveProperty("id");
        expect(userCreatedById).toBeInstanceOf(User);
    });
});
