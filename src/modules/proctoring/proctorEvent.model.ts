import { Schema, model, Types } from "mongoose";

const proctorSchema = new Schema(
    {
        resultId: {
            type: Types.ObjectId,
            ref: "Result",
            required: true,
            unique: true
        },

        events: {
            type: [Schema.Types.Mixed],
            required: true
        }
    },
    { timestamps: true }
);

proctorSchema.index({ resultId: 1 }, { unique: true });

export const ProctorEvent = model("ProctorEvent", proctorSchema);
