import { Request, Response } from "express";
import { Result } from "./result.model";
import { DateTime } from "luxon";
import { StatusCodes } from "http-status-codes";
import { Exam } from "../exams/exam.model";

export const startExam = async (req: Request, res: Response) => {
    const { examId, hiringDriveId } = req.body;
    const userId = req.user?.id

    const result = await Result.create({
        userId,
        examId,
        hiringDriveId,
        startedAt: DateTime.utc().toJSDate(),
        submittedAt: null,
    });

    res.json({ success: true, data: result });
};

export const submitExam = async (req: Request, res: Response) => {
    const { examId, hiringDriveId, score, isPassed } = req.body;

    const userId = req.user!.id;

    const attempt = await Result.findOne({
        userId,
        examId,
        hiringDriveId,
        submittedAt: null,
    });

    if (!attempt) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Active exam attempt not found",
        });
    }

    if (!attempt.startedAt) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Invalid attempt: startedAt missing",
        });
    }

    const exam = await Exam.findOne({ _id: examId, deletedAt: null }).select(
        "duration"
    );

    if (!exam) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Exam not found",
        });
    }

    const now = DateTime.utc();
    const startedAt = DateTime.fromJSDate(attempt.startedAt).toUTC();

    const deadline = startedAt.plus({ minutes: exam.duration + 2 });

    if (now > deadline) {
        return res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            message: "Time is over. You cannot submit this exam now.",
        });
    }

    const submittedAt = now.toJSDate();

    const durationTaken = Math.floor(
        now.diff(startedAt, "seconds").seconds
    );

    attempt.score = score;
    attempt.isPassed = isPassed;
    attempt.submittedAt = submittedAt;
    attempt.durationTaken = durationTaken;

    await attempt.save();

    return res.json({
        success: true,
        message: "Exam submitted successfully",
        data: attempt,
    });
};

export const deleteExam = async (req: Request, res: Response) => {
    const { examId, hiringDriveId } = req.params;
    const userId = req.user?.id;

    const deleted = await Result.findOneAndDelete({ examId, userId, hiringDriveId });

    if (!deleted) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Result not found" });
    }

    res.json({ success: true, message: "Exam deleted successfully", data: deleted });
};

export const getExamResult = async (req: Request, res: Response) => {
    const { examId, hiringDriveId } = req.query;
    const userId = req.user?.id

    const result = await Result.findOne({ examId, userId, hiringDriveId });

    if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Result not found"
        });
    }

    res.json({ success: true, data: result });
};
