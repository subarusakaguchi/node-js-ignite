import { AppError } from "@shared/errors/AppError";

import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationRepositoryInMemory } from "../../repositories/in-memory/SpecificationRepositoryInMemory";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationRepositoryInMemory: SpecificationRepositoryInMemory;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationRepositoryInMemory = new SpecificationRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationRepositoryInMemory
    );
  });
  it("Should not be able to add a new specification to a nonexisting car", async () => {
    expect(async () => {
      const car_id = "12345";
      const specification_ids = ["54321", "98765"];
      await createCarSpecificationUseCase.execute({
        car_id,
        specification_ids,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  it("Should be able to add a new specification to a existing car", async () => {
    const createdCar = await carsRepositoryInMemory.create({
      name: "Car for test",
      description: "Test to create a car",
      daily_rate: 8000,
      license_plate: "TST-0101",
      fine_amount: 30000,
      brand: "FolksWagen",
      category_id: "218302120j30j03j03j02j",
    });

    const specTest = await specificationRepositoryInMemory.create({
      name: "Test",
      description: "Test",
    });

    const updatedCar = await createCarSpecificationUseCase.execute({
      car_id: createdCar.id,
      specification_ids: [specTest.id],
    });

    expect(updatedCar.specifications).toEqual([specTest]);
  });
});
