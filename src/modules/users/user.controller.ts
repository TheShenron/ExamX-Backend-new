import { Request, Response } from "express";
import { User } from "./user.model";
import { HiringDrive } from "../hiring-drives/hiringDrive.model";

export const createUser = async (req: Request, res: Response) => {
    const user = await User.create(req.body);
    res.json({ success: true, data: user });
};

export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
        { _id: userId, deletedAt: null },
        req.body,
        { new: true }
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.json({ success: true, data: user });
};

export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
        { _id: userId, deletedAt: null },
        { deletedAt: new Date() },
        { new: true }
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found or already deleted"
        });
    }

    res.json({ success: true, message: "User deleted successfully" });
};

export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await User.find(
        { deletedAt: null },
        { password: 0 }
    ).sort({ createdAt: -1 });

    res.json({
        success: true,
        data: users
    });
};

export const getUserHiringDrives = async (req: Request, res: Response) => {
    const { userId } = req.params;

    const drives = await HiringDrive.find({
        deletedAt: null,
        "candidates.userId": userId
    })
        .select("name code startsAt endsAt isActive candidates")
        .sort({ createdAt: -1 });

    const data = drives.map(drive => {
        const candidate = drive.candidates.find(
            c => c.userId.toString() === userId
        );

        return {
            _id: drive._id,
            name: drive.name,
            code: drive.code,
            startsAt: drive.startsAt,
            endsAt: drive.endsAt,
            isActive: drive.isActive,
            attemptsUsed: candidate?.attemptsUsed ?? 0
        };
    });

    res.json({
        success: true,
        count: data.length,
        data
    });
};
