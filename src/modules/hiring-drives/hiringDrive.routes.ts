import { Router } from "express";
import { addCandidateToHiringDrive, addExamsToHiringDrive, createHiringDrive, deleteHiringDrive, getHiringDriveCandidates, getHiringDriveExams, getHiringDrives, removeCandidateFromHiringDrive, removeExamFromHiringDrive, updateCandidateAttempts } from "./hiringDrive.controller";
import { verifyToken } from "../../middlewares/verify-token";
import { validateReq } from "../../middlewares/validate-req";
import { addCandidateToHiringDriveBodySchema, addCandidateToHiringDriveParamSchema, addExamHiringDriveBodySchema, addExamHiringDriveParamSchema, createHiringDriveSchema, deleteHiringDriveSchema, getHiringDriveCandidatesSchema, removeCandidateFromHiringDriveSchema, updateCandidateAttemptsSchema } from "./hiringDrive.validator";

const router = Router();

router.post("/", verifyToken, validateReq({ body: createHiringDriveSchema }), createHiringDrive);
router.get("/", verifyToken, getHiringDrives);
router.delete("/:id", verifyToken, validateReq({ params: deleteHiringDriveSchema }), deleteHiringDrive);
router.get("/:id/candidates", verifyToken, validateReq({ params: getHiringDriveCandidatesSchema }), getHiringDriveCandidates);
router.post("/:id/candidates", verifyToken, validateReq({ params: addCandidateToHiringDriveParamSchema, body: addCandidateToHiringDriveBodySchema }), addCandidateToHiringDrive);
router.delete("/:id/candidates/:userId", verifyToken, validateReq({ params: removeCandidateFromHiringDriveSchema }), removeCandidateFromHiringDrive);
router.patch("/:id/candidates/:userId/attempts/:action", verifyToken, validateReq({ params: updateCandidateAttemptsSchema }), updateCandidateAttempts);
router.post("/:id/exam", verifyToken, validateReq({ params: addExamHiringDriveParamSchema, body: addExamHiringDriveBodySchema }), addExamsToHiringDrive);
router.delete("/:id/exams/:examId", verifyToken, validateReq({ params: removeCandidateFromHiringDriveSchema }), removeExamFromHiringDrive);
router.get("/:id/exams", verifyToken, validateReq({ params: deleteHiringDriveSchema }), getHiringDriveExams);


export default router;
