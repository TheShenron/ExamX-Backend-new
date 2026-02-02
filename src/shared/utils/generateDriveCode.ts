import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
    6
);

export function generateDriveCode() {
    return nanoid(); // e.g. K9X2LM
}
