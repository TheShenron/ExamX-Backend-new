import { Router } from "express";
import { addProctoringResult, deleteProctoringResult, getProctoringResult } from "./proctor.controller";
import { verifyToken } from "../../middlewares/verify-token";
import { validateReq } from "../../middlewares/validate-req";
import { addProctoringBodySchema, addProctoringParamSchema, deleteProctoringResultSchema, getProctoringResultSchema } from "./proctor.validator";

const router = Router();
router.post("/:resultId/proctoring", verifyToken, validateReq({ params: addProctoringParamSchema, body: addProctoringBodySchema }), addProctoringResult);
router.delete("/:resultId/proctoring", verifyToken, validateReq({ params: deleteProctoringResultSchema }), deleteProctoringResult);
router.get("/:resultId/proctoring", verifyToken, validateReq({ params: getProctoringResultSchema }), getProctoringResult);

export default router;
