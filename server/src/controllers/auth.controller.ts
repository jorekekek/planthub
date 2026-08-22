import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginUser, registerUser } from "../services/auth.service";

export async function registerController(
  req: Request,
  res: Response,
) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid request data",
      details: result.error.flatten(),
    });
    return;
  }

  try {
    const user = await registerUser(result.data);

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      res.status(409).json({
        error: "Email is already registered",
      });
      return;
    }

    console.error("Failed to register user:", error);

    res.status(500).json({
      error: "Failed to register user",
    });
  }
}

export async function loginController(
  req: Request,
  res: Response,
) {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: "Invalid request data",
      details: validation.error.flatten(),
    });
    return;
  }

  try {
    const loginResult = await loginUser(validation.data);

    res.json({
      data: loginResult,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({
        error: "Invalid email or password",
      });
      return;
    }

    console.error("Failed to log in:", error);

    res.status(500).json({
      error: "Failed to log in",
    });
  }
}