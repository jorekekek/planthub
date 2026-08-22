import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  const token = authorization.slice("Bearer ".length);

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured.");

    res.status(500).json({
      error: "Authentication configuration error",
    });
    return;
  }

  try {
  const payload = jwt.verify(token, jwtSecret);

if (
  typeof payload !== "object" ||
  payload === null ||
  typeof payload.sub !== "string" &&
  typeof payload.sub !== "number" ||
  typeof payload.email !== "string"
) {
  res.status(401).json({
    error: "Invalid token",
  });
  return;
}

const userId = Number(payload.sub);

if (!Number.isInteger(userId) || userId <= 0) {
  res.status(401).json({
    error: "Invalid token",
  });
  return;
}

(req as AuthenticatedRequest).user = {
  id: userId,
  email: payload.email,
};

next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    res.status(401).json({
      error: "Invalid or expired token",
      reason: error instanceof Error ? error.message : "Unknown JWT error",
    });
  }
}   