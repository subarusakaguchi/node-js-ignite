import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

import { Rental } from "../../infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../../repositories/IRentalsRepository";

interface ICreateRentalUseCaseRequest {
  car_id: string;
  user_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}
  async execute({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalUseCaseRequest): Promise<Rental> {
    const minHours = 24;

    const rentalExistsForCar = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    if (rentalExistsForCar) {
      throw new AppError("This car is already rented");
    }

    const rentalExistsForUser =
      await this.rentalsRepository.findOpenRentalByUser(user_id);

    if (rentalExistsForUser) {
      throw new AppError("There is another Rental for this user");
    }

    const dateNow = this.dateProvider.dateNow();

    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date
    );

    if (compare < minHours) {
      throw new AppError("Invalid return time");
    }

    const rental = this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailable(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };
