import { inject, injectable } from "tsyringe";

import { AppError } from "@errors/AppError";

import { ISpecificationRepository } from "../../repositories/ISpecificationRepository";

interface IRequestCreateSpecification {
    name: string;
    description: string;
}

@injectable()
class CreateSpecificationUseCase {
    constructor(
        @inject("SpecificationRepository")
        private specificationRepository: ISpecificationRepository
    ) {}

    async execute({ name, description }: IRequestCreateSpecification) {
        const specificationAlreadyExists =
            await this.specificationRepository.findByName(name);

        if (specificationAlreadyExists) {
            throw new AppError("Speficition Already Exists!");
        }

        await this.specificationRepository.create({ name, description });
    }
}

export { CreateSpecificationUseCase };
