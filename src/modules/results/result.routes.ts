import { Router } from "express";
import { startExam, submitExam } from "./result.controller";

const router = Router();

router.post("/start", startExam);
router.post("/submit", submitExam);

export default router;
