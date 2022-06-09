import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../entities/User";
import { IUserRepository } from "../IUserRepository";

class UserRepositoryInMemory implements IUserRepository {
    users: User[] = [];

    async create({
        name,
        password,
        email,
        driver_license,
    }: ICreateUserDTO): Promise<void> {
        const newUser = new User();

        Object.assign(newUser, {
            name,
            password,
            email,
            driver_license,
        });

        this.users.push(newUser);
    }
    async findByEmail(email: string): Promise<User> {
        const user = this.users.find((user) => user.email === email);

        return user;
    }
    async findById(id: string): Promise<User> {
        const user = this.users.find((user) => user.id === id);

        return user;
    }
}

export { UserRepositoryInMemory };
