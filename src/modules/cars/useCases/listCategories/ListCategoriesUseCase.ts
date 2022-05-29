import { Category } from "../../models/Category";
import { ICategoriesRepository } from "../../repositories/categories/ICategoriesRepository";

class ListCategoriesUseCase {
    constructor(private categoriesRepository: ICategoriesRepository) {}
    execute(): Category[] {
        const allCategories = this.categoriesRepository.list();

        return allCategories;
    }
}

export { ListCategoriesUseCase };
