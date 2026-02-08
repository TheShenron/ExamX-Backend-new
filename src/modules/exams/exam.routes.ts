import { Router } from "express";
import { createExam, deleteExam, getAllExams, updateExam } from "./exam.controller";
import { verifyToken } from "../../middlewares/verify-token";
import { validateReq } from "../../middlewares/validate-req";
import { createExamSchema, deleteExamSchema, updateExamSchema } from "./exam.validator";
import { upload } from "../../config/multer";

const router = Router();

router.post("/", verifyToken, upload.single('examZipFile'), validateReq({ body: createExamSchema }), createExam);
router.get("/", verifyToken, getAllExams);
router.put("/:id", verifyToken, validateReq({ body: updateExamSchema }), updateExam);
router.delete("/:id", verifyToken, validateReq({ params: deleteExamSchema }), deleteExam);

export default router;
