import { Router } from "express";
import { deleteExam, startExam, submitExam, getExamResult } from "./result.controller";
import { verifyToken } from "../../middlewares/verify-token";
import { validateReq } from "../../middlewares/validate-req";
import { startExamSchema, submitExamSchema, deleteExamxamSchema, getExamResultSchema } from "./result.validator";
import proctoringRoutes from "../proctoring/proctor.routes";

const router = Router();

// proctoring routes
router.use("/", proctoringRoutes);

router.post("/start", verifyToken, validateReq({ body: startExamSchema }), startExam);
router.post("/submit", verifyToken, validateReq({ body: submitExamSchema }), submitExam);
router.delete(":examId/:hiringDriveId/delete", verifyToken, validateReq({ params: deleteExamxamSchema }), deleteExam);
router.get(":examId/get/:hiringDriveId", verifyToken, validateReq({ params: getExamResultSchema }), getExamResult);

export default router;
