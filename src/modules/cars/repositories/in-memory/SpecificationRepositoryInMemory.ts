import { Specification } from "../../entities/Specification";
import {
    ICreateSpecificationDTO,
    ISpecificationRepository,
} from "../ISpecificationRepository";

class SpecificationRepositoryInMemory implements ISpecificationRepository {
    specifications: Specification[] = [];

    async create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<void> {
        const newSpecification = new Specification();

        Object.assign(newSpecification, {
            name,
            description,
            created_at: new Date(),
        });

        this.specifications.push(newSpecification);
    }

    async findByName(name: string): Promise<Specification> {
        const specification = this.specifications.find(
            (spec) => spec.name === name
        );

        return specification;
    }
}

export { SpecificationRepositoryInMemory };
