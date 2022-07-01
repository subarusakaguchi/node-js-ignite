import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCarUseCase } from "./CreateCarUseCase";

class CreateCarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const {
      name,
      description,
      brand,
      license_plate,
      fine_amount,
      daily_rate,
      category_id,
    } = req.body;

    const createCarUseCase = container.resolve(CreateCarUseCase);

    const newCar = await createCarUseCase.execute({
      name,
      description,
      brand,
      license_plate,
      fine_amount,
      daily_rate,
      category_id,
    });

    return res.status(201).json(newCar);
  }
}

export { CreateCarController };
