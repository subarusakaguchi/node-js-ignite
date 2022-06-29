import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { Car } from "../../infra/typeorm/entities/Car";
import { ICarsRepository } from "../../repositories/ICarsRepository";

interface IRequestCreateCarUseCase {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;
}

@injectable()
class CreateCarUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}
  async execute({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
  }: IRequestCreateCarUseCase): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findCarByLicensePlate(
      license_plate
    );

    if (carAlreadyExists) {
      throw new AppError("License plate already exists");
    }

    const createdCar = await this.carsRepository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
    });

    return createdCar;
  }
}

export { CreateCarUseCase };
