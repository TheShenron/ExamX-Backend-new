import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: 'Unauthorized',
            message: 'No token provided',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

        if (!decoded || typeof decoded !== 'object') {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: 'Unauthorized',
                message: 'Invalid token payload',
            });
        }

        req.user = decoded;
        next();
    } catch {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: 'Unauthorized',
            message: 'Invalid token',
        });
    }
};

export const allowRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole || !roles.includes(userRole)) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Forbidden",
            });
        }

        next();
    };
};
