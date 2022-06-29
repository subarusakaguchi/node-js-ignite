import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listCarsUseCase: ListAvailableCarsUseCase;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  });
  it("Should be able to list All Available Cars", async () => {
    const createdCar = await carsRepositoryInMemory.create({
      name: "Car test",
      description: "Car for Test",
      brand: "Test Brand",
      license_plate: "XXX-XXXX",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxx",
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([createdCar]);
  });
  it("Should be able to list All Available Cars by name", async () => {
    const createdCar1 = await carsRepositoryInMemory.create({
      name: "Car test 1",
      description: "Car for Test",
      brand: "Test Brand",
      license_plate: "XXX-XXXXX",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxx",
    });

    const createdCar2 = await carsRepositoryInMemory.create({
      name: "Car test 2",
      description: "Car for Test",
      brand: "Test Brand",
      license_plate: "XXX-XXXXY",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxx",
    });

    const createdCar3 = await carsRepositoryInMemory.create({
      name: "Car test 3",
      description: "Car for Test",
      brand: "Test Brand",
      license_plate: "XXX-XXXXZ",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxx",
    });

    const cars = await listCarsUseCase.execute({ name: createdCar2.name });

    expect(cars).toEqual([createdCar2]);
  });
  it("Should be able to list All Available Cars by brand", async () => {
    const createdCar1 = await carsRepositoryInMemory.create({
      name: "Car test 1",
      description: "Car for Test",
      brand: "Test Brand",
      license_plate: "XXX-XXXXX",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxx",
    });

    const createdCar2 = await carsRepositoryInMemory.create({
      name: "Car test 2",
      description: "Car for Test",
      brand: "Test Brand 2",
      license_plate: "XXX-XXXXY",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxx",
    });

    const createdCar3 = await carsRepositoryInMemory.create({
      name: "Car test 3",
      description: "Car for Test",
      brand: "Test Brand 2",
      license_plate: "XXX-XXXXZ",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxx",
    });

    const cars = await listCarsUseCase.execute({ brand: createdCar2.brand });

    expect(cars).toEqual([createdCar2, createdCar3]);
  });
  it("Should be able to list All Available Cars", async () => {
    const createdCar1 = await carsRepositoryInMemory.create({
      name: "Car test 1",
      description: "Car for Test",
      brand: "Test Brand",
      license_plate: "XXX-XXXXX",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxx",
    });

    const createdCar2 = await carsRepositoryInMemory.create({
      name: "Car test 2",
      description: "Car for Test",
      brand: "Test Brand",
      license_plate: "XXX-XXXXY",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxx",
    });

    const createdCar3 = await carsRepositoryInMemory.create({
      name: "Car test 3",
      description: "Car for Test",
      brand: "Test Brand",
      license_plate: "XXX-XXXXZ",
      fine_amount: 500,
      daily_rate: 80,
      category_id: "xxxx-xxxx-xxxx-xxxxZ",
    });

    const cars = await listCarsUseCase.execute({
      category_id: createdCar2.category_id,
    });

    expect(cars).toEqual([createdCar1, createdCar2]);
  });
});
