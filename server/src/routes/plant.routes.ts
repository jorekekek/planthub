import { Router } from "express";
import {
  createPlantController,
  deletePlantController,
  getPlantByIdController,
  getPlantsController,
  updatePlantController,
} from "../controllers/plant.controller";

const router = Router();

router.get("/", getPlantsController);
router.get("/:id", getPlantByIdController);
router.post("/", createPlantController);
router.patch("/:id", updatePlantController);
router.delete("/:id", deletePlantController);

export default router;