import { Schema, model, Types } from "mongoose";

const proctorSchema = new Schema(
    {
        resultId: {
            type: Types.ObjectId,
            ref: "Result",
            required: true,
            unique: true
        },

        userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
        examId: { type: Types.ObjectId, ref: "Exam", required: true, index: true },
        hiringDriveId: { type: Types.ObjectId, ref: "HiringDrive", index: true },

        events: {
            type: [Schema.Types.Mixed],
            required: true
        }
    },
    { timestamps: true }
);

proctorSchema.index({ examId: 1, createdAt: -1 });
proctorSchema.index({ hiringDriveId: 1, createdAt: -1 });
proctorSchema.index({ userId: 1, examId: 1 });

export const ProctorEvent = model("ProctorEvent", proctorSchema);
