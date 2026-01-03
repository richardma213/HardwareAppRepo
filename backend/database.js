import mongoose from "mongoose";

/**
 * Method to connect the backend to the mongoDB server 
 * using a private MONGO_URL
 */
export async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    } catch (e){
        console.error("MongoDB connection error", e);
    }
}