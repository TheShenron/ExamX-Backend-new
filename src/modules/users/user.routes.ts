import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserHiringDrives, loginUser, updateUser } from "./user.controller";
import { validateReq } from "../../middlewares/validate-req";
import { createUserSchema, loginSchema } from "./user.validator";
import { verifyToken } from "../../middlewares/verify-token";

const router = Router();

router.get("/", verifyToken, getAllUsers);
router.post("/", validateReq({ body: createUserSchema }), createUser);
router.post("/login", validateReq({ body: loginSchema }), loginUser);
router.put("/:userId", validateReq({ body: createUserSchema }), verifyToken, updateUser);
router.delete("/:userId", verifyToken, deleteUser);
router.get("/:userId/hiring-drives", verifyToken, getUserHiringDrives);

export default router;
