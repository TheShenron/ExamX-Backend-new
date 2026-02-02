import { Router } from "express";
import { createExam, deleteExam, getAllExams, updateExam } from "./exam.controller";

const router = Router();

router.post("/", createExam);
router.get("/", getAllExams);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;
