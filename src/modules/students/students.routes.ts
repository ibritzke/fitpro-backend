import { Router } from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  uploadStudentPhoto,
  setStudentPin,
  toggleStudentStatus,
} from "./students.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../config/upload/multer";

const router = Router();
router.use(authMiddleware);

router.get("/", getStudents);
router.post("/", createStudent);
router.get("/:id", getStudentById);
router.post("/:id/photo", upload.single("photo"), uploadStudentPhoto);
router.patch("/:id/pin", setStudentPin);
router.patch("/:id/status", toggleStudentStatus);

export default router;