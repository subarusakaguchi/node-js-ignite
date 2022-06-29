import { ICreateRentalDTO } from "../../../cars/dtos/ICreateRentalDTO";
import { Rental } from "../../infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepositoryInMemory implements IRentalsRepository {
  private repository: Rental[];

  constructor() {
    this.repository = [];
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const newRental = new Rental();

    Object.assign(newRental, {
      car_id,
      user_id,
      expected_return_date,
      created_at: new Date(),
      updated_at: new Date(),
      start_date: new Date(),
    });

    this.repository.push(newRental);

    return newRental;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    return this.repository.find(
      (rental) => rental.car_id === car_id && !rental.end_date
    );
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.repository.find(
      (rental) => rental.user_id === user_id && !rental.end_date
    );
  }
}

export { RentalsRepositoryInMemory };
