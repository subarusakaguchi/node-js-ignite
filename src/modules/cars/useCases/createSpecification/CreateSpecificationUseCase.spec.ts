import { AppError } from "@errors/AppError";

import { Specification } from "../../entities/Specification";
import { SpecificationRepositoryInMemory } from "../../repositories/in-memory/SpecificationRepositoryInMemory";
import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

let specificationRepository: SpecificationRepositoryInMemory;
let createSpecificationUseCase: CreateSpecificationUseCase;

describe("Create specification", () => {
    beforeEach(() => {
        specificationRepository = new SpecificationRepositoryInMemory();
        createSpecificationUseCase = new CreateSpecificationUseCase(
            specificationRepository
        );
    });

    it("Should be able to create a specification", async () => {
        const specification = {
            name: "Teste Spec 1",
            description: "Descrição da spec 1",
        };

        await createSpecificationUseCase.execute(specification);

        const specCreated = await specificationRepository.findByName(
            specification.name
        );

        expect(specCreated).toBeDefined();
        expect(specCreated).toHaveProperty("id");
        expect(specCreated).toBeInstanceOf(Specification);
    });

    it("Should not be able to create a specification with the same name", async () => {
        expect(async () => {
            const specification = {
                name: "Teste Spec 1",
                description: "Descrição da spec 1",
            };

            await createSpecificationUseCase.execute(specification);
            await createSpecificationUseCase.execute(specification);
        }).rejects.toBeInstanceOf(AppError);
    });
});
