import { ICreateCarDTO } from "../../dtos/ICreateCarDTO";
import { IListCarsDTO } from "../../dtos/IListCarsDTO";
import { Car } from "../../infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    id,
    name,
    description,
    brand,
    license_plate,
    fine_amount,
    daily_rate,
    specifications,
    category_id,
  }: ICreateCarDTO): Promise<Car> {
    const newCar = new Car();

    Object.assign(newCar, {
      id,
      name,
      description,
      brand,
      license_plate,
      fine_amount,
      daily_rate,
      specifications,
      category_id,
    });

    this.cars.push(newCar);

    return newCar;
  }

  async findCarByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAllAvailable({
    name,
    brand,
    category_id,
  }: IListCarsDTO): Promise<Car[]> {
    const carsAvailable = this.cars.filter((car) => {
      return car.available === true;
    });

    if (name || brand || category_id) {
      const cars = carsAvailable.filter(
        (carAvailable) =>
          (name && carAvailable.name === name) ||
          (brand && carAvailable.brand === brand) ||
          (category_id && carAvailable.category_id === category_id)
      );

      return cars;
    }

    return carsAvailable;
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => {
      return car.id === id;
    });
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const index = this.cars.findIndex((car) => car.id === id);
    this.cars[index].available = available;
  }
}

export { CarsRepositoryInMemory };
