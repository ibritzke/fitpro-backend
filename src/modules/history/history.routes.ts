import { Router } from "express";
import { saveHistory, getStudentHistory, updateWeight, getLastWeights } from "./history.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware);

router.post("/", saveHistory);
router.post("/weight", updateWeight);
router.get("/last-weights/:studentId", getLastWeights);
router.get("/:studentId", getStudentHistory);

export default router;