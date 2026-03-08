import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  // 1. get correlationId from req.headers
  // 2. log the incoming request (method, url, correlationId)
  // 3. listen to res "finish" event to log response (statusCode, duration)
  // hint: res.on("finish", () => { ... })
  const correlationId = req.headers["x-correlation-id"] || "N/A";
  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
    correlationId,
  });
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      correlationId,
    });
  });

  next();
};
