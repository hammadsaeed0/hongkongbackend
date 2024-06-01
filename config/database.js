import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://hammadsaeed083:hammadsaeed083@cluster0.rdzphvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
