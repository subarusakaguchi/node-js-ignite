import { Category } from "../../entities/Category";
import { CategoryRepositoryInMemory } from "../../repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategoryUseCase } from "../createCategory/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

let categoryRepositoryInMemory: CategoryRepositoryInMemory;
let listCategoryUseCase: ListCategoriesUseCase;
let createCategoryUseCase: CreateCategoryUseCase;

describe("List Categories", () => {
    beforeAll(() => {
        categoryRepositoryInMemory = new CategoryRepositoryInMemory();
        listCategoryUseCase = new ListCategoriesUseCase(
            categoryRepositoryInMemory
        );
        createCategoryUseCase = new CreateCategoryUseCase(
            categoryRepositoryInMemory
        );
    });

    it("Should show all categories available in storage", async () => {
        const categoriesTest = [
            {
                name: "Teste 1",
                description: "Descrição do teste 1",
            },
            {
                name: "Teste 2",
                description: "Descrição do teste 2",
            },
            {
                name: "Teste 3",
                description: "Descrição do teste 3",
            },
        ];

        await createCategoryUseCase.execute(categoriesTest[0]);
        await createCategoryUseCase.execute(categoriesTest[1]);
        await createCategoryUseCase.execute(categoriesTest[2]);

        const allCategories = await listCategoryUseCase.execute();

        allCategories.forEach((cat) => {
            expect(cat).toBeDefined();
            expect(cat).toHaveProperty("id");
            expect(cat).toBeInstanceOf(Category);
        });
    });
});
