import { container } from "tsyringe";

import { CategoryRepository } from "../../modules/cars/repositories/categories/CategoryRepository";
import { ICategoryRepository } from "../../modules/cars/repositories/categories/ICategoryRepository";
import { ISpecificationRepository } from "../../modules/cars/repositories/specifications/ISpecificationRepository";
import { SpecificationRepository } from "../../modules/cars/repositories/specifications/SpecificationRepository";

container.registerSingleton<ICategoryRepository>(
    "CategoryRepository",
    CategoryRepository
);

container.registerSingleton<ISpecificationRepository>(
    "SpecificationRepository",
    SpecificationRepository
);
