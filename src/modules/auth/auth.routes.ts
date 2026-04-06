import { Router } from "express";
import { register, login, studentLogin, getMe, changePassword, refreshToken } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/student-login", studentLogin);
router.get("/me", authMiddleware, getMe);
router.put("/change-password", authMiddleware, changePassword);
router.post("/refresh", refreshToken);
export default router;