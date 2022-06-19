import { getRepository, Repository } from "typeorm";

import {
  ICategoryRepository,
  ICreateCategoryDTO,
} from "../../../repositories/ICategoryRepository";
import { Category } from "../entities/Category";

class CategoryRepository implements ICategoryRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const newCategory = this.repository.create({
      name,
      description,
    });

    await this.repository.save(newCategory);
  }

  async list(): Promise<Category[]> {
    const allCategories = await this.repository.find();

    return allCategories;
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.repository.findOne({ name });

    return category;
  }
}

export { CategoryRepository };
