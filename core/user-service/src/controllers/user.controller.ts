import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AppError } from "../types/errors";
import logger from "../utils/logger";

export class UserController {
  constructor(private service: UserService) {}

  async signup(req: Request, res: Response): Promise<void> {
    // your turn:
    // 1. extract data from req.body
    const data = req.body;
    // 2. call this.service.signup()
    try {
      const userResponse = await this.service.signup(data);
      // 3. return 201 with the user response
      res.status(201).json(userResponse);
    } catch (error) {
      // 4. catch AppError → return error.statusCode + error.message
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        // 5. catch unknown errors → return 500
        logger.error("Unexpected error", {
          error,
          correlationId: req.headers["x-correlation-id"],
        });
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
}
