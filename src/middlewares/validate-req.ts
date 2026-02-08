import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, ZodType } from "zod";

interface ValidateSchemas {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
}

interface ValidatedRequest extends Request {
    validatedData?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
    };
}

export const validateReq = (schemas: ValidateSchemas) => {
    return async (
        req: ValidatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const validated: Record<string, unknown> = {};

            if (schemas.body) {
                const result = await schemas.body.parseAsync(req.body);
                req.body = result;
                validated.body = result;
            }

            if (schemas.query) {
                const result = await schemas.query.parseAsync(req.query);
                req.query = result as any;
                validated.query = result;
            }

            if (schemas.params) {
                const result = await schemas.params.parseAsync(req.params);
                req.params = result as any;
                validated.params = result;
            }

            req.validatedData = validated;
            next();
        } catch (err) {
            if (err instanceof ZodError) {

                if (err instanceof ZodError) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Validation error",
                        errors: err.issues.map((e) => ({
                            path: e.path.join("."),
                            message: e.message,
                        })),
                    });
                }
                return;
            }

            next(err);
        }
    };
};