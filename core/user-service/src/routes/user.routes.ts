import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export const createUserRouter = (controller: UserController): Router => {
  const router = Router();

  // POST /signup → controller.signup
  // remember to bind the controller method correctly
  router.post("/signup", controller.signup.bind(controller));
  router.get("/verify-email", controller.verifyEmail.bind(controller));

  return router;
};
