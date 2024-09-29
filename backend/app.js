import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import { config } from "dotenv";
import { connection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRoutes from "./Routes/userRoutes.js";
import jobRoutes from "./Routes/jobRoutes.js";
import applicationRoutes from "./Routes/applicationRoutes.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";

config({ path: "./.env" });

const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Use the routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);

// newsLetterCron();

connection(); // Connect to the database

app.use(errorMiddleware); // Handle errors

export default app;
