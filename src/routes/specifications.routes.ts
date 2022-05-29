import { Router, Response } from "express";

import { createSpecificationController } from "../modules/cars/useCases/createSpecification";

const specificationsRoutes = Router();

specificationsRoutes.post("/", (req, res): Response => {
    return createSpecificationController.handle(req, res);
});

export { specificationsRoutes };
