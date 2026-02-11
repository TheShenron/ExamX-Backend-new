import z from "zod";
import { objectIdSchema } from "../hiring-drives/hiringDrive.validator";

export const startExamSchema = z.object({
    examId: objectIdSchema,
    hiringDriveId: objectIdSchema,
});

export const submitExamSchema = z.object({
    examId: objectIdSchema,
    hiringDriveId: objectIdSchema,
    score: z.coerce.number().min(0, "Score must be >= 0"),
    isPassed: z.coerce.boolean(),
});


export const deleteExamxamSchema = z.object({
    examId: objectIdSchema,
    hiringDriveId: objectIdSchema
});

export const getExamResultByExamIdSchema = z.object({
    examId: objectIdSchema,
    hiringDriveId: objectIdSchema
});

export const getExamResultSchema = z.object({
    hiringDriveId: objectIdSchema,
    userId: objectIdSchema
});



