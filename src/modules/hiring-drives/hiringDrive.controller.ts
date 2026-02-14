import { Request, Response } from "express";
import { HiringDrive } from "./hiringDrive.model";
import { generateDriveCode } from "../../shared/utils/generateDriveCode";
import { StatusCodes } from "http-status-codes";
import { Result } from "../results/result.model";

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
        { returnDocument: "after" }
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

    const candidateIdsSet = new Set(
        drive.candidates.map(c => c.userId.toString())
    );

    const newUserIds = userId.filter((id: string) => !candidateIdsSet.has(id));

    if (newUserIds.length === 0) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "All given candidates are already added",
        });
    }

    drive.candidates.push(
        ...newUserIds.map((id: string) => ({
            userId: id,
            attemptsUsed: 0,
            maxAttempts: drive.maxAttempts,
        }))
    );

    await drive.save();

    res.json({
        success: true,
        message: "Candidates added successfully",
        added: newUserIds,
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
        "candidates.userId": userId,
    };

    // dec should not go below 1
    if (action === "dec") {
        query.candidates = {
            $elemMatch: {
                userId: userId,
                maxAttempts: { $gt: 1 },
            },
        };
    }

    const updated = await HiringDrive.findOneAndUpdate(
        query,
        {
            $inc: { "candidates.$.maxAttempts": action === "inc" ? 1 : -1 },
        },
        { returnDocument: "after" }
    ).select("candidates");

    if (!updated) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message:
                action === "dec"
                    ? "Cannot decrement (maxAttempts already 1 or candidate not found)"
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
            maxAttempts: candidate?.maxAttempts ?? 1,
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
        { returnDocument: "after" }
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
        { returnDocument: "after" }
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
    }).populate({
        path: "exams",
        select: "-examZipFile",
    });

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

export const getHiringDriveResults = async (req: Request, res: Response) => {
    const { id } = req.params;

    const drive = await HiringDrive.findOne({
        _id: id,
        deletedAt: null,
    }).populate("candidates.userId", "name email");

    if (!drive) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Hiring drive not found",
        });
    }

    // get ALL results (history)
    const results = await Result.find({ hiringDriveId: id })
        .populate("examId", "title totalMarks")
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .lean();

    // group by userId
    const resultMap = new Map<string, any[]>();

    for (const r of results) {
        const uid = r.userId?._id?.toString();
        if (!uid) continue;

        if (!resultMap.has(uid)) resultMap.set(uid, []);
        resultMap.get(uid)!.push(r);
    }

    const candidates = drive.candidates.map((c) => {
        const uid = c.userId?._id?.toString();
        const history = uid ? resultMap.get(uid) || [] : [];

        // calculate summary using BEST attempt per exam (only submitted)
        const bestScoreByExam = new Map<string, number>();

        for (const r of history) {
            if (r.status !== "submitted") continue;

            const examId = r.examId?._id?.toString();
            if (!examId) continue;

            const prev = bestScoreByExam.get(examId) ?? 0;
            bestScoreByExam.set(examId, Math.max(prev, r.score || 0));
        }

        const totalScore = [...bestScoreByExam.values()].reduce((a, b) => a + b, 0);

        return {
            user: c.userId,
            attemptsUsed: c.attemptsUsed,

            summary: {
                totalScore,
                overallPassed: totalScore >= drive.passingMarks,
            },

            history, // full attempts list
        };
    });

    return res.json({
        success: true,
        data: {
            drive: {
                _id: drive._id,
                name: drive.name,
                passingMarks: drive.passingMarks,
            },
            candidates,
        },
    });
};

