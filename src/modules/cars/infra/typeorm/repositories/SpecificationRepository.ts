import { Repository, getRepository } from "typeorm";

import {
    ICreateSpecificationDTO,
    ISpecificationRepository,
} from "@src/modules/cars/repositories/ISpecificationRepository";

import { Specification } from "../entities/Specification";

class SpecificationRepository implements ISpecificationRepository {
    private repository: Repository<Specification>;

    constructor() {
        this.repository = getRepository(Specification);
    }

    async create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<void> {
        const newSpecification = this.repository.create({
            name,
            description,
        });

        await this.repository.save(newSpecification);
    }

    async findByName(name: string): Promise<Specification> {
        const specification = await this.repository.findOne({ name });

        return specification;
    }
}

export { SpecificationRepository };
