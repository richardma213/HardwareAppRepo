import mongoose from "mongoose";

/**
 * Report Schema
 * Represents a saved benchmark report from a specified user
 * 
 * Each report stores:
 * - The user who created it
 * - The weight configuration used in scoring
 * - The selected CPUs and GPUs
 * - The timestamp of creation
 */

const ReportSchema = new mongoose.Schema({

    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weights: Object,
    cpus: Array,
    gpus: Array,
    createdAt: {type: Date, default: Date.now}

});

export default mongoose.model("Report", ReportSchema);