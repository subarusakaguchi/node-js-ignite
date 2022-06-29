import { Specification } from "../../infra/typeorm/entities/Specification";
import {
  ICreateSpecificationDTO,
  ISpecificationRepository,
} from "../ISpecificationRepository";

class SpecificationRepositoryInMemory implements ISpecificationRepository {
  specifications: Specification[] = [];

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const newSpecification = new Specification();

    Object.assign(newSpecification, {
      name,
      description,
      created_at: new Date(),
    });

    this.specifications.push(newSpecification);

    return newSpecification;
  }

  async findByName(name: string): Promise<Specification> {
    const specification = this.specifications.find(
      (spec) => spec.name === name
    );

    return specification;
  }

  async findByIds(ids: string[]): Promise<Specification[] | undefined> {
    const specs = this.specifications.filter((spec) => {
      return ids.includes(spec.id);
    });

    return specs;
  }
}

export { SpecificationRepositoryInMemory };
