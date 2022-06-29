import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

class CreateCarSpecificationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { specification_ids } = req.body;

    const createCarSpecificationUseCase = container.resolve(
      CreateCarSpecificationUseCase
    );

    const updatedCar = await createCarSpecificationUseCase.execute({
      car_id: id,
      specification_ids,
    });

    return res.json(updatedCar);
  }
}

export { CreateCarSpecificationController };
