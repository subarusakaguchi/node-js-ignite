import { Request, Response } from "express";
import { container } from "tsyringe";

import { UploadCarImagesUseCase } from "./UploadCarImageUseCase";

interface IImages {
  filename: string;
}

class UploadCarImagesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const images = req.files as unknown as IImages[];

    const uploadCarImagesUseCase = container.resolve(UploadCarImagesUseCase);

    const filenames = images.map((image) => {
      return image.filename;
    });

    const carImages = await uploadCarImagesUseCase.execute({
      car_id: id,
      images_name: filenames,
    });

    return res.status(201).json(carImages);
  }
}

export { UploadCarImagesController };
