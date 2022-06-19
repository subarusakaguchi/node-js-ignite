import { Router } from "express";

import { CreateCarController } from "@src/modules/cars/useCases/createCar/CreateCarController";

const carsRoutes = Router();

const createCarController = new CreateCarController();

carsRoutes.post("/", createCarController.handle);

export { carsRoutes };
