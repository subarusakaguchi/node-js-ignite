import { inject, injectable } from "tsyringe";

import { AppError } from "@src/shared/errors/AppError";

import { ICategoryRepository } from "../../repositories/ICategoryRepository";

interface IRequestCreateCategory {
    name: string;
    description: string;
}

@injectable()
class CreateCategoryUseCase {
    constructor(
        @inject("CategoryRepository")
        private categoriesRepository: ICategoryRepository
    ) {}

    async execute({
        name,
        description,
    }: IRequestCreateCategory): Promise<void> {
        const categoryAlreadyExists =
            await this.categoriesRepository.findByName(name);

        if (categoryAlreadyExists) {
            throw new AppError("Category Already Exists!");
        }

        await this.categoriesRepository.create({ name, description });
    }
}

export { CreateCategoryUseCase };
