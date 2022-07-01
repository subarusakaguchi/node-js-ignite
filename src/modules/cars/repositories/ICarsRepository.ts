import { ICreateCarDTO } from "../dtos/ICreateCarDTO";
import { IListCarsDTO } from "../dtos/IListCarsDTO";
import { Car } from "../infra/typeorm/entities/Car";

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findCarByLicensePlate(license_plate: string): Promise<Car>;
  findAllAvailable(data: IListCarsDTO): Promise<Car[]>;
  findById(id: string): Promise<Car>;
  updateAvailable(id: string, available: boolean): Promise<void>;
}

export { ICarsRepository };
