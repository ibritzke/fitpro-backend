import { Router } from "express";
import {
  createWorkoutType, getWorkoutTypes, addExerciseToWorkoutType,
  updateWorkoutTypeExercise, removeExerciseFromWorkoutType, deleteWorkoutType,
} from "./workoutTypes.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);
router.use(requireRole("TRAINER", "ADMIN"));

router.get("/", getWorkoutTypes);
router.post("/", createWorkoutType);
router.delete("/:id", deleteWorkoutType);
router.post("/exercises", addExerciseToWorkoutType);
router.put("/exercises/:id", updateWorkoutTypeExercise);
router.delete("/exercises/:id", removeExerciseFromWorkoutType);

export default router;