import Router from "express";

import { SendForgottenEmailPasswordController } from "@modules/accounts/useCases/sendForgottenEmailPassword/SendForgottenEmailPasswordController";

const passwordRoutes = Router();

const sendForgottenEmailPasswordController =
  new SendForgottenEmailPasswordController();

passwordRoutes.post("/forgotten", sendForgottenEmailPasswordController.handle);

export { passwordRoutes };
