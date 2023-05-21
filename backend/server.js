import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
import userRoute from "./routes/userRoute.js";
import propertyRoute from "./routes/propertyRoute.js";
import orderRoute from "./routes/orderRoute.js";

app.use("/api/users", userRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/orders", orderRoute);

//Error Middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
