import { Request, Response } from "express";
import { ProctorEvent } from "./proctorEvent.model";
import { Result } from "../results/result.model";

export const addProctoringResult = async (req: Request, res: Response) => {
    const { resultId } = req.params;
    const { events } = req.body;

    if (!Array.isArray(events)) {
        return res.status(400).json({
            success: false,
            message: "events must be an array"
        });
    }

    const resultExists = await Result.exists({ _id: resultId });
    if (!resultExists) {
        return res.status(404).json({
            success: false,
            message: "Result not found"
        });
    }

    try {
        const proctoring = await ProctorEvent.create({
            resultId,
            events
        });

        res.json({
            success: true,
            data: proctoring
        });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Proctoring data already exists for this result"
            });
        }

        throw err;
    }
};

export const deleteProctoringResult = async (req: Request, res: Response) => {
    const { resultId } = req.params;

    const deleted = await ProctorEvent.findOneAndDelete({
        resultId
    });

    if (!deleted) {
        return res.status(404).json({
            success: false,
            message: "Proctoring data not found"
        });
    }

    res.json({
        success: true,
        message: "Proctoring data deleted successfully"
    });
};

export const getProctoringResult = async (req: Request, res: Response) => {
    const { resultId } = req.params;

    const proctoring = await ProctorEvent.findOne({ resultId });

    if (!proctoring) {
        return res.status(404).json({
            success: false,
            message: "Proctoring data not found"
        });
    }

    res.json({ success: true, data: proctoring });
};




