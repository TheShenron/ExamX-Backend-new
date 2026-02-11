import { Router } from "express";
import { addProctoringResult, deleteProctoringResult, getMyProctoringResult, getUserProctoringResult } from "./proctor.controller";
import { allowRoles, verifyToken } from "../../middlewares/verify-token";
import { validateReq } from "../../middlewares/validate-req";
import { addProctoringBodySchema, addProctoringParamSchema, deleteProctoringResultSchema, getProctoringResultSchema } from "./proctor.validator";
import { ADMIN, CANDIDATE, HR } from "../../shared/constants/enums";

const router = Router();
router.post("/:resultId/proctoring", verifyToken, validateReq({ params: addProctoringParamSchema, body: addProctoringBodySchema }), allowRoles(ADMIN, CANDIDATE), addProctoringResult);
router.delete("/:resultId/proctoring", verifyToken, validateReq({ params: deleteProctoringResultSchema }), allowRoles(ADMIN), deleteProctoringResult);
// router.get("/:resultId/proctoring", verifyToken, validateReq({ params: getProctoringResultSchema }), allowRoles(ADMIN, HR), getMyProctoringResult);
// router.get("/:resultId/proctoring/:userId", verifyToken, validateReq({ params: getProctoringResultSchema }), allowRoles(ADMIN, HR), getUserProctoringResult);

export default router;
