import { Router } from "express";
import { assignWorkoutDay, getStudentSchedule, getTodayWorkout, removeWorkoutDay, completeWorkout } from "./studentWorkouts.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { studentSelfOnly, trainerOwnsStudent } from "../../middlewares/student.middleware";

const router = Router();
router.use(authMiddleware);

router.post("/", trainerOwnsStudent, assignWorkoutDay);
router.get("/schedule/:studentId", studentSelfOnly, trainerOwnsStudent, getStudentSchedule);
router.get("/today/:studentId", studentSelfOnly, getTodayWorkout);
router.delete("/:id", removeWorkoutDay);
router.post("/complete", completeWorkout)

export default router;
