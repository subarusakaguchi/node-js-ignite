import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { AppError } from "@errors/AppError";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUserRepository } from "../../repositories/IUserRepository";

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("UserRepository")
        private userRepository: IUserRepository
    ) {}
    async execute({
        name,
        email,
        password,
        driver_license,
    }: ICreateUserDTO): Promise<void> {
        const usernameAlreadyExists = await this.userRepository.findByEmail(
            email
        );

        if (usernameAlreadyExists) {
            throw new AppError("Username Already Exists!");
        }

        const encryptedPassword = await hash(password, 8);

        await this.userRepository.create({
            name,
            email,
            password: encryptedPassword,
            driver_license,
        });
    }
}

export { CreateUserUseCase };
