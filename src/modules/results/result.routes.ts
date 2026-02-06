import { Router } from "express";
import { deleteExam, startExam, submitExam, getExamResult } from "./result.controller";

const router = Router();

router.post("/start", startExam);
router.post("/submit", submitExam);
router.delete("/delete", deleteExam);
router.get("/get", getExamResult);

export default router;
