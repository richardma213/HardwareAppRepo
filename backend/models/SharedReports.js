import mongoose from "mongoose";

const SharedReportSchema = mongoose.Schema({
    ownerId: {type: String, required: false},
    data: {type: Object, required: true},
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },   
    isPublic: { type: Boolean, default: true }
});

export default mongoose.model("SharedReport", SharedReportSchema);

