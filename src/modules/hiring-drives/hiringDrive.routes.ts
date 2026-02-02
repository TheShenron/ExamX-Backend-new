import { Router } from "express";
import { addCandidateToHiringDrive, addExamToHiringDrive, createHiringDrive, getHiringDriveCandidates, getHiringDrives, removeCandidateFromHiringDrive, removeExamFromHiringDrive, updateCandidateAttempts } from "./hiringDrive.controller";

const router = Router();

router.post("/", createHiringDrive);
router.get("/", getHiringDrives);
router.get("/:id/candidates", getHiringDriveCandidates);
router.post("/:id/candidates", addCandidateToHiringDrive);
router.delete("/:id/candidates/:userId", removeCandidateFromHiringDrive);
router.patch("/:id/candidates/:userId/attempts", updateCandidateAttempts);

router.post("/:id/exam", addExamToHiringDrive);
router.delete("/:id/exams/:examId", removeExamFromHiringDrive);

export default router;
