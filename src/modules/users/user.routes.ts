import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserHiringDrives, updateUser } from "./user.controller";

const router = Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);
router.get("/:userId/hiring-drives", getUserHiringDrives);

export default router;
