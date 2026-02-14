import express, { Application, Request, Response } from "express";
import cors from "cors";
import { errorMiddleware } from "./shared/middlewares/error.middleware";

import userRoutes from "./modules/users/user.routes";
import hiringDriveRoutes from "./modules/hiring-drives/hiringDrive.routes";
import examRoutes from "./modules/exams/exam.routes";
import resultRoutes from "./modules/results/result.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', environment: process.env.NODE_ENV, msg: 'Kanshi Backend' });
});

app.use("/api/users", userRoutes);
app.use("/api/hiring-drives", hiringDriveRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);

app.use(errorMiddleware);


export default app;
