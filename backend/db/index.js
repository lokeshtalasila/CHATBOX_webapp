import mongoose from "mongoose";

const connectdb = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        const connectionString = process.env.MONGODB_URI;
        console.log(`Attempting to connect to MongoDB at: ${connectionString}`);

        const connectionIN = await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`\nMongoDB connected!! DB Host: ${connectionIN.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed...", error);
        process.exit(1);
    }
};

export default connectdb;
