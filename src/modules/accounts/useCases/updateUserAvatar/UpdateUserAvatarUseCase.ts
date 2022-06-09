import { inject, injectable } from "tsyringe";

import { deleteFile } from "../../../../utils/file";
import { IUserRepository } from "../../repositories/IUserRepository";

interface IRequestUpdateUserAvatarUseCase {
    user_id: string;
    avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
    constructor(
        @inject("UserRepository")
        private userRepository: IUserRepository
    ) {}

    async execute({
        user_id,
        avatarFile,
    }: IRequestUpdateUserAvatarUseCase): Promise<void> {
        const user = await this.userRepository.findById(user_id);

        if (user.avatar) {
            await deleteFile(`./temp/avatar/${user.avatar}`);
        }

        user.avatar = avatarFile;

        await this.userRepository.create(user);
    }
}

export { UpdateUserAvatarUseCase };
