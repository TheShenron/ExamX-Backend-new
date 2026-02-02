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
    const { resultId, score, isPassed } = req.body;

    const submittedAt = new Date();

    const result = await Result.findByIdAndUpdate(
        resultId,
        {
            score,
            isPassed,
            submittedAt,
            durationTaken:
                (submittedAt.getTime() -
                    new Date(req.body.startedAt).getTime()) /
                1000
        },
        { new: true }
    );

    res.json({ success: true, data: result });
};
