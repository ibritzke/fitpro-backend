/*
  Warnings:

  - A unique constraint covering the columns `[accessCode]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - The required column `accessCode` was added to the `Student` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentWorkoutDay" DROP CONSTRAINT "StudentWorkoutDay_workoutTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutTemplateExercise" DROP CONSTRAINT "WorkoutTemplateExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutTypeExercise" DROP CONSTRAINT "WorkoutTypeExercise_exerciseId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "accessCode" TEXT NOT NULL,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Student_accessCode_key" ON "Student"("accessCode");

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutTypeExercise" ADD CONSTRAINT "WorkoutTypeExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutTemplateExercise" ADD CONSTRAINT "WorkoutTemplateExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentWorkoutDay" ADD CONSTRAINT "StudentWorkoutDay_workoutTypeId_fkey" FOREIGN KEY ("workoutTypeId") REFERENCES "WorkoutType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
