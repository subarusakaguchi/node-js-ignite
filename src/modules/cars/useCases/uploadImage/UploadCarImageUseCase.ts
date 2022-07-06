import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { CarImages } from "../../infra/typeorm/entities/CarImages";
import { ICarImagesRepository } from "../../repositories/ICarImagesRepository";
import { ICarsRepository } from "../../repositories/ICarsRepository";

interface IUploadCarImagesUseCaseRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject("CarImagesRepository")
    private carImagesRepository: ICarImagesRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}
  async execute({
    car_id,
    images_name,
  }: IUploadCarImagesUseCaseRequest): Promise<CarImages[]> {
    const carExists = await this.carsRepository.findById(car_id);

    if (!carExists) {
      throw new AppError("Car not Found");
    }

    const carImagesReturn: CarImages[] = [];

    await Promise.all(
      images_name.map(async (image) => {
        const carImage = await this.carImagesRepository.create(car_id, image);
        carImagesReturn.push(carImage);
        await this.storageProvider.save(image, "cars");
      })
    );

    return carImagesReturn;
  }
}

export { UploadCarImagesUseCase };
