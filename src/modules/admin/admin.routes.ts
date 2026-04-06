import { Router } from "express";
import {
  createTrainer,
  getTrainers,
  getDashboard,
  toggleTrainerStatus,
  uploadTrainerLogo,
} from "./admin.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { upload } from "../../config/upload/multer";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/trainers", getTrainers);
router.post("/trainers", createTrainer);
router.patch("/trainers/:id/status", toggleTrainerStatus);
router.post("/trainers/:id/logo", upload.single("logo"), uploadTrainerLogo);

export default router;