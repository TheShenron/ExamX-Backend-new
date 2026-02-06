import { Request, Response } from "express";
import { HiringDrive } from "./hiringDrive.model";
import { generateDriveCode } from "../../shared/utils/generateDriveCode";

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
        return res.status(404).json({
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
        deletedAt: null
    })
        .populate("candidates.userId", "name email")
        .select("candidates");

    if (!drive) {
        return res.status(404).json({
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
    const { userId } = req.body;

    const drive = await HiringDrive.findOne({
        _id: id,
        deletedAt: null
    });

    if (!drive) {
        return res.status(404).json({
            success: false,
            message: "Hiring drive not found"
        });
    }

    const alreadyExists = drive.candidates.some(c =>
        c.userId.toString() === userId
    );

    if (alreadyExists) {
        return res.status(400).json({
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
        return res.status(404).json({
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
    const { id, userId } = req.params;
    const { incrementBy = 1, setTo } = req.body;

    const drive = await HiringDrive.findOne({
        _id: id,
        deletedAt: null
    });

    if (!drive) {
        return res.status(404).json({
            success: false,
            message: "Hiring drive not found"
        });
    }

    const candidate = drive.candidates.find(
        c => c.userId.toString() === userId
    );

    if (!candidate) {
        return res.status(404).json({
            success: false,
            message: "Candidate not found in drive"
        });
    }

    if (typeof setTo === "number") {
        candidate.attemptsUsed = Math.max(0, setTo);
    } else {
        candidate.attemptsUsed += Math.max(1, incrementBy);
    }

    await drive.save();

    res.json({
        success: true,
        data: {
            userId: candidate.userId,
            attemptsUsed: candidate.attemptsUsed
        }
    });
};

export const addExamToHiringDrive = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { examId } = req.body;

    const drive = await HiringDrive.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $addToSet: { exams: examId } },
        { new: true }
    );

    if (!drive) {
        return res.status(404).json({
            success: false,
            message: "Hiring drive not found"
        });
    }

    res.json({
        success: true,
        message: "Exam added successfully"
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
        return res.status(404).json({
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
        return res.status(404).json({
            success: false,
            message: "Hiring drive not found",
        });
    }

    res.json({
        success: true,
        data: drive.exams,
    });
};


