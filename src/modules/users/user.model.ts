import { Schema, model } from "mongoose";
import { UserSchema } from "./user.validator";

const userSchema = new Schema<UserSchema>(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, enum: ["admin", "hr", "candidate"], default: "candidate" },
        deletedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

export const User = model("User", userSchema);
