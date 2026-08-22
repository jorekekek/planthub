import { Router } from "express";
import {
  createPlantController,
  deletePlantController,
  getPlantByIdController,
  getPlantsController,
  updatePlantController,
} from "../controllers/plant.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getPlantsController);
router.get("/:id", getPlantByIdController);
router.post("/", createPlantController);
router.patch("/:id", updatePlantController);
router.delete("/:id", deletePlantController);

export default router;