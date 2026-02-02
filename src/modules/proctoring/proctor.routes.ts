import { Router } from "express";
import { addProctoringResult, getProctoringResult } from "./proctor.controller";

const router = Router();
router.post("/:resultId/proctoring", addProctoringResult);
router.delete("/:resultId/proctoring", addProctoringResult);
router.get("/:resultId/proctoring", getProctoringResult);

export default router;
