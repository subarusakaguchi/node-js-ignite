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
    id,
    car_id,
    user_id,
    expected_return_date,
    total,
    end_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const newRental = this.rentals.create({
      id,
      car_id,
      user_id,
      expected_return_date,
      total,
      end_date,
    });

    await this.rentals.save(newRental);

    return newRental;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const opneByCar = await this.rentals.findOne({
      where: { car_id, end_date: null },
    });

    return opneByCar;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const opneByUser = await this.rentals.findOne({
      where: { user_id, end_date: null },
    });

    return opneByUser;
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.rentals.findOne({ id });

    return rental;
  }

  async findRentalsByUserID(user_id: string): Promise<Rental[]> {
    const rentals = await this.rentals.find({
      where: { user_id },
      relations: ["car"],
    });

    return rentals;
  }
}

export { RentalsRepository };
