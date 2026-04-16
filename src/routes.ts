import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import userRoutes from "./modules/users/users.routes";
import studentRoutes from "./modules/students/students.routes";
import categoryRoutes from "./modules/categories/categories.routes";
import subcategoryRoutes from "./modules/subcategories/subcategories.routes";
import exerciseRoutes from "./modules/exercises/exercises.routes";
import workoutTypeRoutes from "./modules/workoutTypes/workoutTypes.routes";
import templateRoutes from "./modules/templates/templates.routes";
import studentWorkoutRoutes from "./modules/studentWorkouts/studentWorkouts.routes";
import historyRoutes from "./modules/history/history.routes";
import { getTrainerPublicInfo } from "./modules/users/users.controller";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/categories", categoryRoutes);
router.use("/subcategories", subcategoryRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/workout-types", workoutTypeRoutes);
router.use("/templates", templateRoutes);
router.use("/student-workouts", studentWorkoutRoutes);
router.use("/history", historyRoutes);

// Public routes for trainers
router.get("/trainers/:id", getTrainerPublicInfo);

export default router;
