import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";

import { IUserRepository } from "../../repositories/IUserRepository";

interface IRequestUpdateUserAvatarUseCase {
  user_id: string;
  avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute({
    user_id,
    avatarFile,
  }: IRequestUpdateUserAvatarUseCase): Promise<void> {
    const user = await this.userRepository.findById(user_id);

    if (user.avatar) {
      await this.storageProvider.delete(user.avatar, "avatar");
    }

    await this.storageProvider.save(avatarFile, "avatar");

    user.avatar = avatarFile;

    await this.userRepository.create(user);
  }
}

export { UpdateUserAvatarUseCase };
