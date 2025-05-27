import mongoose from "mongoose"

export const connectToDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected successfully!");
    } catch (error) {
        console.error("Failed to connect to db");
        process.exit(1);
    }
}