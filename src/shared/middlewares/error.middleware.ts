import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export function errorMiddleware(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: err.message || "Something went wrong"
    });
}
