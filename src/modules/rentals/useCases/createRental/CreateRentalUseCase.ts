import { inject, injectable } from "tsyringe";

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
    private dayjsDateProvider: IDateProvider
  ) {}
  async execute({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalUseCaseRequest): Promise<Rental> {
    const minHours = 24;

    const rentalExistsForUser =
      await this.rentalsRepository.findOpenRentalByUser(user_id);

    if (rentalExistsForUser) {
      throw new AppError("There is another Rental for this user");
    }

    const rentalExistsForCar = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    if (rentalExistsForCar) {
      throw new AppError("This car is already rented");
    }

    const dateNow = this.dayjsDateProvider.dateNow();

    const compare = this.dayjsDateProvider.compare(
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

    return rental;
  }
}

export { CreateRentalUseCase };
