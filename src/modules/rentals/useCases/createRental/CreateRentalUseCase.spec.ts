import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { Rental } from "../../infra/typeorm/entities/Rental";
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let dayjsDateProvider: DayjsDateProvider;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
  const diff24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });
  it("Should be able to create a new rental", async () => {
    const rental = {
      car_id: "12345",
      user_id: "54321",
      expected_return_date: diff24Hours,
    };

    const createdRental = await createRentalUseCase.execute(rental);

    expect(createdRental).toHaveProperty("id");
    expect(createdRental).toBeInstanceOf(Rental);
  });
  it("Should not be able to create a new rental with invalid return time", async () => {
    expect(async () => {
      const diffDayTest = dayjs().add(23, "hours").toDate();
      const rental = {
        car_id: "12345",
        user_id: "54321",
        expected_return_date: diffDayTest,
      };

      await createRentalUseCase.execute(rental);
    }).rejects.toBeInstanceOf(AppError);
  });
  it("Should not be able to create a new rental if there is another open for the same user", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "123",
        user_id: "54321",
        expected_return_date: diff24Hours,
      });
      await createRentalUseCase.execute({
        car_id: "321",
        user_id: "54321",
        expected_return_date: diff24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  it("Should not be able to create a new rental if there is another open for the same car", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "12345",
        user_id: "123",
        expected_return_date: diff24Hours,
      });
      await createRentalUseCase.execute({
        car_id: "12345",
        user_id: "321",
        expected_return_date: diff24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
