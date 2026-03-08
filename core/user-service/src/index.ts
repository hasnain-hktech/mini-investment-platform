import express from "express";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { createUserRouter } from "./routes/user.routes";
import { ResendEmailService } from "./services/email.service";
import { correlationIdMiddleware } from "./middleware/correlationId";
import { requestLoggerMiddleware } from "./middleware/requestLogger";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(correlationIdMiddleware);
app.use(requestLoggerMiddleware);

// 1. instantiate PrismaClient
// 2. instantiate UserRepository with prisma
// 3. instantiate ResendEmailService
// 4. instantiate UserService with repository, and ResendEmailService
// 5. instantiate UserController with service
// 6. create the router with createUserRouter(controller)
// 7. mount the router at /api/v1/users

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const emailService = new ResendEmailService();
const userService = new UserService(userRepository, emailService);
const userController = new UserController(userService);
const userRouter = createUserRouter(userController);

app.use("/api/v1/users", userRouter);

// health check endpoint

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "user-service" });
});

app.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`);
});
