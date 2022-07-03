import { AppError } from "@shared/errors/AppError";

import { Car } from "../../infra/typeorm/entities/Car";
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });
  it("Should be able to create a new car", async () => {
    const car = {
      name: "Car for test",
      description: "Test to create a car",
      daily_rate: 8000,
      license_plate: "TST-0101",
      fine_amount: 30000,
      brand: "FolksWagen",
      category_id: "218302120j30j03j03j02j",
    };

    const createdCar = await createCarUseCase.execute(car);

    expect(createdCar).toBeInstanceOf(Car);
  });
  it("Should not be able to create a car with an existing license plate", async () => {
    await createCarUseCase.execute({
      name: "Car for test",
      description: "Test to create a car",
      daily_rate: 8000,
      license_plate: "TST-0101",
      fine_amount: 30000,
      brand: "FolksWagen",
      category_id: "218302120j30j03j03j02j",
    });

    await expect(
      createCarUseCase.execute({
        name: "Car for test",
        description: "Test to create a car",
        daily_rate: 8000,
        license_plate: "TST-0101",
        fine_amount: 30000,
        brand: "FolksWagen",
        category_id: "218302120j30j03j03j02j",
      })
    ).rejects.toEqual(new AppError("License plate already exists"));
  });
  it("Should be able to create a car with available true by default", async () => {
    const createdCar = await createCarUseCase.execute({
      name: "Car for test",
      description: "Test to create a car",
      daily_rate: 8000,
      license_plate: "TST-0101",
      fine_amount: 30000,
      brand: "FolksWagen",
      category_id: "218302120j30j03j03j02j",
    });

    expect(createdCar.available).toBeTruthy();
  });
});
