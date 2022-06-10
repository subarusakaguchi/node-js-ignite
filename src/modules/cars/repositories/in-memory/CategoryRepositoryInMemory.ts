import { Category } from "../../infra/typeorm/entities/Category";
import {
    ICategoryRepository,
    ICreateCategoryDTO,
} from "../ICategoryRepository";

class CategoryRepositoryInMemory implements ICategoryRepository {
    categories: Category[] = [];

    async findByName(name: string): Promise<Category> {
        const category = this.categories.find((cat) => cat.name === name);

        return category;
    }

    async list(): Promise<Category[]> {
        return this.categories;
    }

    async create({ name, description }: ICreateCategoryDTO): Promise<void> {
        const newCategory = new Category();

        Object.assign(newCategory, {
            name,
            description,
            created_at: new Date(),
        });

        this.categories.push(newCategory);
    }
}

export { CategoryRepositoryInMemory };
