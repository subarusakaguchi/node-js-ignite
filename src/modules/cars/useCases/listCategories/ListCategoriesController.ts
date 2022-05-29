import { Request, Response } from "express";

import { Category } from "../../models/Category";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

class ListCategoriesController {
    constructor(private listCategoriesUseCase: ListCategoriesUseCase) {}
    handle(req: Request, res: Response): Response<Category[]> {
        const allCategories = this.listCategoriesUseCase.execute();

        return res.status(200).json(allCategories);
    }
}

export { ListCategoriesController };
