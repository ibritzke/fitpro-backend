import { Router } from "express";
import { createCategory, getCategories, deleteCategory } from "./categories.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);
router.use(requireRole("TRAINER", "ADMIN"));

router.get("/", getCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

export default router;