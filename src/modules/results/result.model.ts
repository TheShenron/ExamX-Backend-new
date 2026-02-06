import { Schema, model, Types } from "mongoose";

const resultSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "User" },
        examId: { type: Types.ObjectId, ref: "Exam" },
        hiringDriveId: { type: Types.ObjectId, ref: "HiringDrive" },

        startedAt: Date,
        submittedAt: Date,
        durationTaken: Number,

        score: Number,
        isPassed: Boolean,
    },
    { timestamps: true }
);


resultSchema.index({ userId: 1, examId: 1 });

export const Result = model("Result", resultSchema);
