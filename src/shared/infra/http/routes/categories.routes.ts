import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateCategoryController } from "@modules/cars/useCases/createCategory/CreateCategoryController";
import { ImportCategoriesController } from "@modules/cars/useCases/importCategories/ImportCategoriesController";
import { ListCategoriesController } from "@modules/cars/useCases/listCategories/ListCategoriesController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const createCategoryController = new CreateCategoryController();
const importCategoryController = new ImportCategoriesController();
const listCategoriesController = new ListCategoriesController();

const uploadCategories = multer(uploadConfig);

const categoriesRoutes = Router();

categoriesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCategoryController.handle
);

categoriesRoutes.post(
  "/import",
  ensureAuthenticated,
  ensureAdmin,
  uploadCategories.single("file"),
  importCategoryController.handle
);

categoriesRoutes.get("/", listCategoriesController.handle);

export { categoriesRoutes };
