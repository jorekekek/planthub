import type { Request, Response } from "express";
import {
  createPlant,
  deletePlant,
  getPlantById,
  getPlants,
  updatePlant,
} from "../services/plant.service";

import {
  createPlantSchema,
  updatePlantSchema,
} from "../validators/plant.validator";

export async function getPlantsController(
  _req: Request,
  res: Response,
) {
  try {
    const plants = await getPlants();

    res.json({
      data: plants,
    });
  } catch (error) {
    console.error("Failed to fetch plants:", error);

    res.status(500).json({
      error: "Failed to fetch plants",
    });
  }
}
export async function getPlantByIdController(
  req: Request,
  res: Response,
) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      error: "Invalid plant ID",
    });
    return;
  }

  try {
    const plant = await getPlantById(id);

    if (!plant) {
      res.status(404).json({
        error: "Plant not found",
      });
      return;
    }

    res.json({
      data: plant,
    });
  } catch (error) {
    console.error("Failed to fetch plant:", error);

    res.status(500).json({
      error: "Failed to fetch plant",
    });
  }
}
export async function createPlantController(
  req: Request,
  res: Response,
) {
  const result = createPlantSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid request data",
      details: result.error.flatten(),
    });
    return;
  }

  try {
    const plant = await createPlant(result.data);

    res.status(201).json({
      data: plant,
    });
  } catch (error) {
    console.error("Failed to create plant:", error);

    res.status(500).json({
      error: "Failed to create plant",
    });
  }
}
export async function updatePlantController(
  req: Request,
  res: Response,
) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      error: "Invalid plant ID",
    });
    return;
  }

  const result = updatePlantSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid request data",
      details: result.error.flatten(),
    });
    return;
  }

  try {
    const existingPlant = await getPlantById(id);

    if (!existingPlant) {
      res.status(404).json({
        error: "Plant not found",
      });
      return;
    }

    const plant = await updatePlant(id, result.data);

    res.json({
      data: plant,
    });
  } catch (error) {
    console.error("Failed to update plant:", error);

    res.status(500).json({
      error: "Failed to update plant",
    });
  }
}

export async function deletePlantController(
  req: Request,
  res: Response,
) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      error: "Invalid plant ID",
    });
    return;
  }

  try {
    const existingPlant = await getPlantById(id);

    if (!existingPlant) {
      res.status(404).json({
        error: "Plant not found",
      });
      return;
    }

    await deletePlant(id);

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete plant:", error);

    res.status(500).json({
      error: "Failed to delete plant",
    });
  }
}