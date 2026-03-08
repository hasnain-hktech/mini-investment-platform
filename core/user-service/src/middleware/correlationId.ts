import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const correlationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // 1. get correlationId from x-correlation-id header or generate new one
  // 2. set it on req.headers
  // 3. set it on res header
  // 4. call next()
  const correlationId = req.header("x-correlation-id") || crypto.randomUUID();
  req.headers["x-correlation-id"] = correlationId;
  res.header("x-correlation-id", correlationId);
  next();
};
