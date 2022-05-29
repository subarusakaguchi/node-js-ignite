import { Specification } from "../../models/Specification";
import {
    ICreateSpecificationDTO,
    ISpecificationRepository,
} from "./ISpecificationRepository";

class SpecificationRepository implements ISpecificationRepository {
    private specifications: Specification[];

    private static INSTANCE: SpecificationRepository;

    private constructor() {
        this.specifications = [];
    }

    public static getInstance(): SpecificationRepository {
        if (!SpecificationRepository.INSTANCE) {
            SpecificationRepository.INSTANCE = new SpecificationRepository();
        }

        return SpecificationRepository.INSTANCE;
    }

    create({ name, description }: ICreateSpecificationDTO): void {
        const newSpecification = new Specification();

        Object.assign(newSpecification, {
            name,
            description,
            created_at: new Date(),
        });

        this.specifications.push(newSpecification);
    }

    findByName(name: string): Specification {
        const specification = this.specifications.find((spec) => {
            return spec.name === name;
        });

        return specification;
    }
}

export { SpecificationRepository };
