import { inject, injectable } from "tsyringe";

import { Category } from "../../entities/Category";
import { ICategoryRepository } from "../../repositories/ICategoryRepository";

@injectable()
class ListCategoriesUseCase {
    constructor(
        @inject("CategoryRepository")
        private categoriesRepository: ICategoryRepository
    ) {}
    async execute(): Promise<Category[]> {
        const allCategories = await this.categoriesRepository.list();

        return allCategories;
    }
}

export { ListCategoriesUseCase };
