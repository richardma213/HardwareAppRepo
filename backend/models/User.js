import mongoose from "mongoose";

/**
 * User Schema
 *
 * Represents an authenticated user in the system storing login credentials 
 *
 * Fields:
 *  - email: Unique identifier for the user, used for login
 *  - password: Hashed password (never stored in plain text)
 */

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
})

export default mongoose.model("User", userSchema);