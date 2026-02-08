import { Request, Response } from "express";
import { User } from "./user.model";
import { HiringDrive } from "../hiring-drives/hiringDrive.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN ?? '3600');
import { StatusCodes } from 'http-status-codes'
import { Types } from "mongoose";

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const created_user = new User({ name, email, password: hashedPassword });
    const save_user = await created_user.save();
    const userObj = save_user.toObject() as any;
    delete userObj.password;

    res.json({ success: true, data: userObj });
};

export const loginUser = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.json({
        success: true,
        data: {
            token,
            user: userWithoutPassword,
        }
    });
};

export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findOneAndUpdate(
        { _id: userId, deletedAt: null },
        req.body,
        { new: true }
    );

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
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
        return res.status(StatusCodes.NOT_FOUND).json({
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
        .select("-exams")
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

