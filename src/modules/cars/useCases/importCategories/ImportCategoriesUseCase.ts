import { parse } from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { ICategoryRepository } from "../../repositories/ICategoryRepository";

interface IImportCategories {
    name: string;
    description: string;
}

@injectable()
class ImportCategoriesUseCase {
    constructor(
        @inject("CategoryRepository")
        private categoriesRepository: ICategoryRepository
    ) {}

    async loadCategories(
        file: Express.Multer.File
    ): Promise<IImportCategories[]> {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(file.path);
            const loadedCategories: IImportCategories[] = [];

            const parseFile = parse();

            stream.pipe(parseFile);

            parseFile
                .on("data", async (line) => {
                    const [name, description] = line;

                    loadedCategories.push({
                        name,
                        description,
                    });
                })
                .on("end", () => {
                    fs.promises.unlink(file.path);
                    resolve(loadedCategories);
                })
                .on("error", (err) => {
                    reject(err);
                });
        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const loadedCategories = await this.loadCategories(file);

        loadedCategories.map(async (category) => {
            const categoryAlreadyExists =
                await this.categoriesRepository.findByName(category.name);

            if (!categoryAlreadyExists) {
                await this.categoriesRepository.create(category);
            }
        });
    }
}

export { ImportCategoriesUseCase };
