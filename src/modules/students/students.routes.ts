import { Router } from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  uploadStudentPhoto,
  setStudentPin,
  toggleStudentStatus,
  updateStudent,
  deleteStudent,
  renewStudent,
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
router.patch("/:id/renew", renewStudent);
router.patch("/:id", authMiddleware, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);

export default router;
