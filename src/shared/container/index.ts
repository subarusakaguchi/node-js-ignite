import { container } from "tsyringe";

import { IUserRepository } from "@modules/accounts/repositories/IUserRepository";
import { SpecificationRepository } from "@modules/cars/infra/typeorm/repositories/SpecificationRepository";
import { ICategoryRepository } from "@modules/cars/repositories/ICategoryRepository";
import { ISpecificationRepository } from "@modules/cars/repositories/ISpecificationRepository";
import { UserRepository } from "@src/modules/accounts/infra/typeorm/repositories/UserRepository";
import { CarsRepository } from "@src/modules/cars/infra/typeorm/repositories/CarsRepository";
import { CategoryRepository } from "@src/modules/cars/infra/typeorm/repositories/CategoryRepository";
import { ICarsRepository } from "@src/modules/cars/repositories/ICarsRepository";

container.registerSingleton<ICategoryRepository>(
    "CategoryRepository",
    CategoryRepository
);

container.registerSingleton<ISpecificationRepository>(
    "SpecificationRepository",
    SpecificationRepository
);

container.registerSingleton<IUserRepository>("UserRepository", UserRepository);

container.registerSingleton<ICarsRepository>("CarsRepository", CarsRepository);
