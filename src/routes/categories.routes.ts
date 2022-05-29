import { Router, Response } from "express";

import { Category } from "../modules/cars/models/Category";
import { createCategoryController } from "../modules/cars/useCases/createCategory";
import { listCategoriesController } from "../modules/cars/useCases/listCategories";

const categoriesRoutes = Router();

categoriesRoutes.post("/", (req, res) => {
    return createCategoryController.handle(req, res);
});

categoriesRoutes.get("/", (req, res): Response<Category[]> => {
    return listCategoriesController.handle(req, res);
});

export { categoriesRoutes };
