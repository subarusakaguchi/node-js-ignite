import { ISpecificationRepository } from "../../repositories/specifications/ISpecificationRepository";

interface IRequestCreateSpecification {
    name: string;
    description: string;
}

class CreateSpecificationUseCase {
    constructor(private specificationRepository: ISpecificationRepository) {}

    execute({ name, description }: IRequestCreateSpecification) {
        const specificationAlreadyExists =
            this.specificationRepository.findByName(name);

        if (specificationAlreadyExists) {
            throw new Error("Speficition Already Exists!");
        }

        this.specificationRepository.create({ name, description });
    }
}

export { CreateSpecificationUseCase };
