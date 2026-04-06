import { Router } from "express";
import { uploadMyPhoto } from "./users.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../config/upload/multer";

const router = Router();

router.use(authMiddleware);
router.post("/me/photo", upload.single("photo"), uploadMyPhoto);

export default router;