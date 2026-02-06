import { Request, Response } from "express";
import { Exam } from "./exam.model";

export const createExam = async (req: Request, res: Response) => {
    const exam = await Exam.create(req.body);
    res.json({ success: true, data: exam });
};

export const updateExam = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;
    const exam = await Exam.findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
            ...req.body,
            updatedBy: userId
        },
        { new: true }
    );

    if (!exam) {
        return res.status(404).json({
            success: false,
            message: "Exam not found"
        });
    }

    res.json({ success: true, data: exam });
};

export const deleteExam = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.body.userId;

    const exam = await Exam.findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
            deletedAt: new Date(),
            isActive: false,
            updatedBy: userId
        },
        { new: true }
    );

    if (!exam) {
        return res.status(404).json({
            success: false,
            message: "Exam not found"
        });
    }

    res.json({
        success: true,
        message: "Exam deleted successfully"
    });
};

export const getAllExams = async (req: Request, res: Response) => {
    const exams = await Exam.find({
        deletedAt: null
    })
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: exams.length,
        data: exams
    });
};
