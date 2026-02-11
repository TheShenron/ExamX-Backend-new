import { Router } from "express";
import { addCandidateToHiringDrive, addExamsToHiringDrive, createHiringDrive, deleteHiringDrive, getHiringDriveCandidates, getHiringDriveExams, getHiringDriveResults, getHiringDrives, removeCandidateFromHiringDrive, removeExamFromHiringDrive, updateCandidateAttempts } from "./hiringDrive.controller";
import { allowRoles, verifyToken } from "../../middlewares/verify-token";
import { validateReq } from "../../middlewares/validate-req";
import { addCandidateToHiringDriveBodySchema, addCandidateToHiringDriveParamSchema, addExamHiringDriveBodySchema, addExamHiringDriveParamSchema, createHiringDriveSchema, deleteHiringDriveSchema, getHiringDriveCandidatesSchema, getHiringDriveExamsParamSchema, getHiringDriveResultsParamSchema, removeCandidateFromHiringDriveSchema, removeExamFromHiringDriveParamSchema, updateCandidateAttemptsSchema } from "./hiringDrive.validator";
import { ADMIN, HR } from "../../shared/constants/enums";

const router = Router();

router.post("/", verifyToken, validateReq({ body: createHiringDriveSchema }), allowRoles(ADMIN, HR), createHiringDrive);
router.get("/", verifyToken, allowRoles(ADMIN, HR), getHiringDrives);
router.delete("/:id", verifyToken, validateReq({ params: deleteHiringDriveSchema }), allowRoles(ADMIN, HR), deleteHiringDrive);
router.get("/:id/candidates", verifyToken, validateReq({ params: getHiringDriveCandidatesSchema }), allowRoles(ADMIN, HR), getHiringDriveCandidates);
router.post("/:id/candidates", verifyToken, validateReq({ params: addCandidateToHiringDriveParamSchema, body: addCandidateToHiringDriveBodySchema }), allowRoles(ADMIN, HR), addCandidateToHiringDrive);
router.delete("/:id/candidates/:examId", verifyToken, validateReq({ params: removeCandidateFromHiringDriveSchema }), allowRoles(ADMIN, HR), removeCandidateFromHiringDrive);
router.patch("/:id/candidates/:userId/attempts/:action", verifyToken, validateReq({ params: updateCandidateAttemptsSchema }), allowRoles(ADMIN, HR), updateCandidateAttempts);
router.post("/:id/exam", verifyToken, validateReq({ params: addExamHiringDriveParamSchema, body: addExamHiringDriveBodySchema }), allowRoles(ADMIN, HR), addExamsToHiringDrive);
router.delete("/:id/exams/:examId", verifyToken, validateReq({ params: removeExamFromHiringDriveParamSchema }), allowRoles(ADMIN, HR), removeExamFromHiringDrive);
router.get("/:id/exams", verifyToken, validateReq({ params: getHiringDriveExamsParamSchema }), allowRoles(ADMIN, HR), getHiringDriveExams);
router.get("/:id/results", verifyToken, validateReq({ params: getHiringDriveResultsParamSchema }), allowRoles(ADMIN, HR), getHiringDriveResults);

export default router;
