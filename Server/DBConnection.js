import mongoose from "mongoose";
mongoose.set('strictQuery', true);

export const dbconnect = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
    } catch (error) {
        console.error(`Unable to connect MongoDB: ${error.message}`)
        process.exit(1);
    }
}