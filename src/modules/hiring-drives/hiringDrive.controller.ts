import { Request, Response } from "express";
import { HiringDrive } from "./hiringDrive.model";
import { generateDriveCode } from "../../shared/utils/generateDriveCode";
import { StatusCodes } from "http-status-codes";

export const createHiringDrive = async (req: Request, res: Response) => {
    const drive = await HiringDrive.create({
        ...req.body,
        code: generateDriveCode()
    });

    res.json({ success: true, data: drive });
};

export const getHiringDrives = async (_: Request, res: Response) => {
    const drives = await HiringDrive.find({ deletedAt: null })
        .select("-candidates -exams")
        .sort({ createdAt: -1 });

    res.json({ success: true, data: drives });
};

export const deleteHiringDrive = async (req: Request, res: Response) => {
    const { id } = req.params;

    const drive = await HiringDrive.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date(), isActive: false },
        { new: true }
    );

    if (!drive) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Hiring drive not found",
        });
    }

    res.json({
        success: true,
        message: "Hiring drive deleted successfully",
    });
};

export const getHiringDriveCandidates = async (req: Request, res: Response) => {
    const { id } = req.params;

    const drive = await HiringDrive.findOne({
        _id: id,
        deletedAt: null,
    })
        .select("candidates")
        .populate({
            path: "candidates.userId",
            select: "name email",
            match: { deletedAt: null },
        });

    if (!drive) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Hiring drive not found"
        });
    }

    res.json({
        success: true,
        count: drive.candidates.length,
        data: drive.candidates
    });
};

export const addCandidateToHiringDrive = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body

    const drive = await HiringDrive.findOne({
        _id: id,
        deletedAt: null
    });

    if (!drive) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Hiring drive not found"
        });
    }

    const alreadyExists = drive.candidates.some(c =>
        c.userId.toString() === userId
    );

    if (alreadyExists) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Candidate already added"
        });
    }

    drive.candidates.push({
        userId,
        attemptsUsed: 0
    });

    await drive.save();

    res.json({
        success: true,
        message: "Candidate added successfully"
    });
};

export const removeCandidateFromHiringDrive = async (req: Request, res: Response) => {
    const { id, userId } = req.params;

    const drive = await HiringDrive.findOne({
        _id: id,
        deletedAt: null
    });

    if (!drive) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Hiring drive not found"
        });
    }

    drive.candidates.pull({ userId });

    await drive.save();

    res.json({
        success: true,
        message: "Candidate removed successfully"
    });
};

export const updateCandidateAttempts = async (req: Request, res: Response) => {
    const { id, userId, action } = req.params;

    const query: any = {
        _id: id,
        deletedAt: null,
    };

    // for inc: candidate must exist
    if (action === "inc") {
        query["candidates.userId"] = userId;
    }

    // for dec: candidate must exist AND attemptsUsed > 0
    if (action === "dec") {
        query.candidates = {
            $elemMatch: {
                userId,
                attemptsUsed: { $gt: 0 },
            },
        };
    }

    const updated = await HiringDrive.findOneAndUpdate(
        query,
        {
            $inc: { "candidates.$.attemptsUsed": action === "inc" ? 1 : -1 },
        },
        { new: true }
    ).select("candidates");

    if (!updated) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message:
                action === "dec"
                    ? "Cannot decrement (attempts already 0 or candidate not found)"
                    : "Hiring drive or candidate not found",
        });
    }

    const candidate = updated.candidates.find(
        (c) => c.userId.toString() === userId
    );

    return res.status(StatusCodes.OK).json({
        success: true,
        data: {
            userId,
            attemptsUsed: candidate?.attemptsUsed ?? 0,
        },
    });
};

export const addExamsToHiringDrive = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { examIds } = req.body;

    const drive = await HiringDrive.findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
            $addToSet: {
                exams: { $each: examIds },
            },
        },
        { new: true }
    );

    if (!drive) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Hiring drive not found",
        });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Exam(s) added successfully",
    });
};


export const removeExamFromHiringDrive = async (req: Request, res: Response) => {
    const { id, examId } = req.params;

    const drive = await HiringDrive.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $pull: { exams: examId } },
        { new: true }
    );

    if (!drive) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Hiring drive not found"
        });
    }

    res.json({
        success: true,
        message: "Exam removed successfully"
    });
};

export const getHiringDriveExams = async (req: Request, res: Response) => {
    const { id } = req.params;

    const drive = await HiringDrive.findOne({
        _id: id,
        deletedAt: null,
    }).populate("exams");

    if (!drive) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Hiring drive not found",
        });
    }

    res.json({
        success: true,
        data: drive.exams,
    });
};


