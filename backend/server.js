import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";

//Routes Folders
import userRoute from "./routes/userRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
