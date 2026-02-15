import { z } from "zod";
import { objectIdSchema } from "../hiring-drives/hiringDrive.validator";


export const addProctoringParamSchema = z.object({
    resultId: objectIdSchema,
});

export const deleteProctoringResultSchema = z.object({
    resultId: objectIdSchema,
});

export const getProctoringResultSchema = z.object({
    resultId: objectIdSchema,
    userId: objectIdSchema,
});

export const addProctoringBodySchema = z.object({
    events: z.array(z.any()).min(1, "events must be a non-empty array"),
});
