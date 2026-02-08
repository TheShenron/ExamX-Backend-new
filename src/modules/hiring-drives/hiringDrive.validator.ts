import { z } from "zod";
import { DateTime } from "luxon";
import { Types } from "mongoose";

export const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Id",
});

// reusable ISO date validator using Luxon
export const isoDateString = z.string().refine(
    (val) => DateTime.fromISO(val).isValid,
    {
        message: "Invalid ISO date",
    }
);

export const createHiringDriveSchema = z.object({
    name: z.string().min(2, "Name is required"),

    difficulty: z.enum(["easy", "medium", "hard"], {
        message: "Difficulty is required",
    }),

    passingMarks: z.coerce.number().min(0, "Passing marks must be >= 0"),

    isActive: z.boolean().optional(),

    startsAt: isoDateString,
    endsAt: isoDateString,

    // optional at creation
    candidates: z
        .array(
            z.object({
                userId: z.string().min(1, "userId is required"),
                attemptsUsed: z.coerce.number().min(0).optional(),
            })
        )
        .optional(),

    // optional at creation
    exams: z.array(z.string()).optional(),
})
    .refine(
        (data) =>
            DateTime.fromISO(data.endsAt) > DateTime.fromISO(data.startsAt),
        {
            message: "endsAt must be greater than startsAt",
            path: ["endsAt"],
        }
    )


export const getHiringDriveCandidatesSchema = z.object({
    id: objectIdSchema,
});

export const addCandidateToHiringDriveParamSchema = z.object({
    id: objectIdSchema,
})

export const addCandidateToHiringDriveBodySchema = z.object({
    userId: z.array(objectIdSchema)
})

export const removeCandidateFromHiringDriveSchema = z.object({
    id: objectIdSchema,
    examId: objectIdSchema,
});

export const updateCandidateAttemptsSchema = z.object({
    id: objectIdSchema,
    userId: objectIdSchema,
    action: z.enum(["inc", "dec"], {
        message: "action must be either inc or dec",
    }),
});

export const deleteHiringDriveSchema = z.object({
    id: objectIdSchema,
});

export const addExamHiringDriveParamSchema = z.object({
    id: objectIdSchema,
});

export const addExamHiringDriveBodySchema = z.object({
    examIds: z.array(objectIdSchema)
})