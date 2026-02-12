import { Router } from "express";
import { createUser, deleteMyUser, deleteUserById, getAllUsers, getMyHiringDriveExam, getMyHiringDrives, getUserHiringDriveResult, getUserHiringDrivesById, loginUser, updateMyUser, updateUserById } from "./user.controller";
import { validateReq } from "../../middlewares/validate-req";
import { createUserSchema, getMyHiringDriveExamSchema, loginSchema } from "./user.validator";
import { allowRoles, verifyToken } from "../../middlewares/verify-token";
import { ADMIN, CANDIDATE, HR } from "../../shared/constants/enums";

const router = Router();

router.get("/", verifyToken, allowRoles(ADMIN, HR), getAllUsers);
router.post("/", validateReq({ body: createUserSchema }), createUser);
router.post("/login", validateReq({ body: loginSchema }), loginUser);
router.put("/me", validateReq({ body: createUserSchema }), verifyToken, allowRoles(CANDIDATE), updateMyUser);
router.put("/:userId", validateReq({ body: createUserSchema }), verifyToken, allowRoles(ADMIN), updateUserById);
router.delete("/:userId", verifyToken, allowRoles(ADMIN), deleteUserById);
router.delete("/me", verifyToken, allowRoles(ADMIN), deleteMyUser);
router.get("/me/hiring-drives", verifyToken, allowRoles(ADMIN, CANDIDATE), getMyHiringDrives);
router.get("/:userId/hiring-drives", verifyToken, allowRoles(ADMIN, HR), getUserHiringDrivesById);
router.get("/me/hiring-drives-exam/:driveId", verifyToken, validateReq({ params: getMyHiringDriveExamSchema }), allowRoles(ADMIN, CANDIDATE), getMyHiringDriveExam);
router.get("/:id/results/:userId", verifyToken, allowRoles(ADMIN), getUserHiringDriveResult);

export default router;
