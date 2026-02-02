import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    return res.status(400).json({
        success: false,
        message: err.message || "Something went wrong"
    });
}
