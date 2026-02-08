import { UserPayload } from "../../middlewares/verify-token";

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export { };
