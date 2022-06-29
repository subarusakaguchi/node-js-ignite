import { getRepository, Repository } from "typeorm";

import { ICreateRentalDTO } from "@modules/cars/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

import { Rental } from "../entities/Rental";

class RentalsRepository implements IRentalsRepository {
  private rentals: Repository<Rental>;

  constructor() {
    this.rentals = getRepository(Rental);
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const newRental = this.rentals.create({
      car_id,
      user_id,
      expected_return_date,
    });

    await this.rentals.save(newRental);

    return newRental;
  }
  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const opneByCar = await this.rentals.findOne({ car_id });

    return opneByCar;
  }
  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const opneByUser = await this.rentals.findOne({ user_id });

    return opneByUser;
  }
}

export { RentalsRepository };
