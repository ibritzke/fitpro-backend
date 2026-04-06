import { Router } from "express";
import { createTemplate, getTemplates, addExerciseToTemplate, applyTemplateToWorkoutType, deleteTemplate } from "./templates.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware);

router.get("/", getTemplates);
router.post("/", createTemplate);
router.post("/exercises", addExerciseToTemplate);
router.post("/apply", applyTemplateToWorkoutType);
router.delete("/:id", deleteTemplate);

export default router;