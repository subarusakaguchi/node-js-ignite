import { Request, Response } from "express";
import { container } from "tsyringe";

import { SendForgottenEmailPasswordUseCase } from "./SendForgottenEmailPasswordUseCase";

class SendForgottenEmailPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendForgottenEmailPasswordUseCase = container.resolve(
      SendForgottenEmailPasswordUseCase
    );

    await sendForgottenEmailPasswordUseCase.execute(email);

    return res.json({ message: "Email sent!" });
  }
}

export { SendForgottenEmailPasswordController };
