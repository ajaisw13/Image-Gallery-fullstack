import mongoose from "mongoose";

mongoose.set('strictQuery', true);

export const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.error(`Unable to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
