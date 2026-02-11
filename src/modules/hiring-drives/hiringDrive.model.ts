import { Schema, model, Types } from "mongoose";

const candidateSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "User", required: true },
        attemptsUsed: { type: Number, default: 0 },
        maxAttempts: { type: Number, default: null },
    },
    { _id: false }
);

const hiringDriveSchema = new Schema(
    {
        name: { type: String, unique: true },
        code: { type: String, unique: true },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true
        },

        maxAttempts: { type: Number, default: 1, min: 1 },

        passingMarks: {
            type: Number,
            required: true,
            min: 0
        },

        isActive: {
            type: Boolean,
            default: true
        },

        startsAt: {
            type: Date,
            required: true
        },

        endsAt: {
            type: Date,
            required: true
        },

        candidates: [candidateSchema],
        exams: [{ type: Types.ObjectId, ref: "Exam" }],

        deletedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

hiringDriveSchema.index({ deletedAt: 1 });
hiringDriveSchema.index({ "candidates.userId": 1 });

export const HiringDrive = model("HiringDrive", hiringDriveSchema);
