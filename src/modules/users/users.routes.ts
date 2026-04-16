import { Router } from "express";
import { uploadMyPhoto, uploadMyLogo } from "./users.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../config/upload/multer";

const router = Router();

router.use(authMiddleware);
router.post("/me/photo", upload.single("photo"), uploadMyPhoto);
router.post("/me/logo", upload.single("logo"), uploadMyLogo);

export default router;