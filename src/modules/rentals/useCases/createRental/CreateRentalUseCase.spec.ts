import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { Rental } from "../../infra/typeorm/entities/Rental";
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

jest.useFakeTimers();

let createRentalUseCase: CreateRentalUseCase;
let dateProvider: DayjsDateProvider;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
  const diff24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
      carsRepositoryInMemory
    );
  });
  it("Should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test car",
      description: "Description test",
      daily_rate: 300,
      fine_amount: 250,
      license_plate: "TST-1234",
      brand: "Test",
      category_id: "123456",
    });

    const rental = {
      car_id: car.id,
      user_id: "54321",
      expected_return_date: diff24Hours,
    };

    const createdRental = await createRentalUseCase.execute(rental);

    expect(createdRental).toHaveProperty("id");
    expect(createdRental).toBeInstanceOf(Rental);
  });
  it("Should not be able to create a new rental with invalid return time", async () => {
    const diffDayTest = dayjs().add(23, "hours").toDate();
    const rental = {
      car_id: "12345",
      user_id: "54321",
      expected_return_date: diffDayTest,
    };

    await expect(createRentalUseCase.execute(rental)).rejects.toEqual(
      new AppError("Invalid return time")
    );
  });
  it("Should not be able to create a new rental if there is another open for the same user", async () => {
    const car = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Car for test",
      description: "Test to create a car",
      daily_rate: 8000,
      license_plate: "TST-0101",
      fine_amount: 30000,
      brand: "FolksWagen",
      category_id: "218302120j30j03j03j02j",
    });

    const car2 = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Car for test",
      description: "Test to create a car",
      daily_rate: 8000,
      license_plate: "TSF-0101",
      fine_amount: 30000,
      brand: "FolksWagen",
      category_id: "218302120j30j03j03j02j",
    });

    await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "54321",
      expected_return_date: diff24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car2.id,
        user_id: "54321",
        expected_return_date: diff24Hours,
      })
    ).rejects.toEqual(new AppError("There is another Rental for this user"));
  });
  it("Should not be able to create a new rental if there is another open for the same car", async () => {
    const car = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Car for test",
      description: "Test to create a car",
      daily_rate: 8000,
      license_plate: "TST-0101",
      fine_amount: 30000,
      brand: "FolksWagen",
      category_id: "218302120j30j03j03j02j",
    });

    await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "123",
      expected_return_date: diff24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: "321",
        expected_return_date: diff24Hours,
      })
    ).rejects.toEqual(new AppError("This car is already rented"));
  });
});
