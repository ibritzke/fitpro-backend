import { Router } from "express";
import { createExercise, getExercises, updateExercise, deleteExercise } from "./exercises.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);
router.use(requireRole("TRAINER", "ADMIN"));

router.get("/", getExercises);
router.post("/", createExercise);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

export default router;