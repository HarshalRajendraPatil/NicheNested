import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "Job_Portal" })
    .then(() => console.log("Database connected."))
    .catch((err) => console.log(`Error: ${err.message}`));
};
