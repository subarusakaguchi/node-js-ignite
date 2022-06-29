import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { Car } from "../../infra/typeorm/entities/Car";
import { ICarsRepository } from "../../repositories/ICarsRepository";
import { ISpecificationRepository } from "../../repositories/ISpecificationRepository";

interface ICreateCarSpecificationUseCaseRequest {
  car_id: string;
  specification_ids: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("SpecificationRepository")
    private specificationRepository: ISpecificationRepository
  ) {}
  async execute({
    car_id,
    specification_ids,
  }: ICreateCarSpecificationUseCaseRequest): Promise<Car> {
    const carExists = await this.carsRepository.findById(car_id);

    if (!carExists) {
      throw new AppError("Car not found");
    }

    const specifications = await this.specificationRepository.findByIds(
      specification_ids
    );

    carExists.specifications = specifications;

    const updatedCar = await this.carsRepository.create(carExists);

    return updatedCar;
  }
}

export { CreateCarSpecificationUseCase };
