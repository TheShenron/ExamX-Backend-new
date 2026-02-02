import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,
        deletedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

export const User = model("User", userSchema);
