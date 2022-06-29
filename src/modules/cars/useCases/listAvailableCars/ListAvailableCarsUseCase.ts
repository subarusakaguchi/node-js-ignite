import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "../../repositories/ICarsRepository";

interface IListCarsRequest {
  name?: string;
  brand?: string;
  category_id?: string;
}

@injectable()
class ListAvailableCarsUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}
  async execute({ name, brand, category_id }: IListCarsRequest) {
    const cars = await this.carsRepository.findAllAvailable({
      name,
      brand,
      category_id,
    });

    return cars;
  }
}

export { ListAvailableCarsUseCase };
