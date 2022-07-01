import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IDevolutionRentalUseCaseRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) {}
  async execute({
    id,
    user_id,
  }: IDevolutionRentalUseCaseRequest): Promise<Rental> {
    const minDays = 1;
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);

    if (!rental) {
      throw new AppError("Rental not found", 404);
    }

    const dateNow = this.dayjsDateProvider.dateNow();

    let daily: number = this.dayjsDateProvider.compareInDays(
      rental.start_date,
      dateNow
    );

    if (daily <= 0) {
      daily = minDays;
    }

    const delay = this.dayjsDateProvider.compareInDays(
      dateNow,
      rental.start_date
    );

    let total: number;
    if (delay > 0) {
      const fine = delay * car.fine_amount;
      total = fine;
    }

    total = total ? total + daily * car.daily_rate : daily * car.daily_rate;

    rental.end_date = dateNow;
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
