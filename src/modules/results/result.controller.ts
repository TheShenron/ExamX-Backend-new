import { Request, Response } from "express";
import { Result } from "./result.model";

export const startExam = async (req: Request, res: Response) => {
    const { userId, examId, hiringDriveId } = req.body;

    const result = await Result.create({
        userId,
        examId,
        hiringDriveId,
        startedAt: new Date()
    });

    res.json({ success: true, data: result });
};

export const submitExam = async (req: Request, res: Response) => {
    const { examId, score, isPassed } = req.body;

    const submittedAt = new Date();

    const result = await Result.findOneAndUpdate(
        { examId, submittedAt: null },
        {
            score,
            isPassed,
            submittedAt,
            // durationTaken:
            //     (submittedAt.getTime() -
            //         new Date(req.body.startedAt).getTime()) /
            //     1000
        },
        { new: true }
    );

    res.json({ success: true, data: result });
};

export const deleteExam = async (req: Request, res: Response) => {
    const { examId, userId } = req.body;

    const deleted = await Result.findOneAndDelete({ examId, userId });

    if (!deleted) {
        return res.status(404).json({ success: false, message: "Result not found" });
    }

    res.json({ success: true, message: "Exam deleted successfully", data: deleted });
};

export const getExamResult = async (req: Request, res: Response) => {
    const { examId, userId } = req.query;

    const result = await Result.findOne({ examId, userId });

    if (!result) {
        return res.status(404).json({
            success: false,
            message: "Result not found"
        });
    }

    res.json({ success: true, data: result });
};
