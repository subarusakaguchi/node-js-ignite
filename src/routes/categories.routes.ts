import { Router, Request, Response } from "express";

const categoriesRoutes = Router();

const categories = [];

categoriesRoutes.post("/categories", (req: Request, res: Response) => {
    const { name, description } = req.body;

    const newCategory = {
        name,
        description,
    };

    categories.push(newCategory);

    return res.status(201).json({ categories });
});

export { categoriesRoutes };
