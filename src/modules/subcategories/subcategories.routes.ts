import { Router } from "express";
import { createSubcategory, getSubcategoriesByCategory, deleteSubcategory } from "./subcategories.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);
router.use(requireRole("TRAINER", "ADMIN"));

router.post("/", createSubcategory);
router.get("/category/:categoryId", getSubcategoriesByCategory);
router.delete("/:id", deleteSubcategory);

export default router;