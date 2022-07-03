import Router from "express";

import { ResetPasswordUserController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController";
import { SendForgottenEmailPasswordController } from "@modules/accounts/useCases/sendForgottenEmailPassword/SendForgottenEmailPasswordController";

const passwordRoutes = Router();

const sendForgottenEmailPasswordController =
  new SendForgottenEmailPasswordController();

const resetPasswordUserController = new ResetPasswordUserController();

passwordRoutes.post("/forgotten", sendForgottenEmailPasswordController.handle);

passwordRoutes.post("/reset", resetPasswordUserController.handle);

export { passwordRoutes };
