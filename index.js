import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
app.use(cors());

// import cookieParser from "cookie-parser";

// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger.json" assert { type: "json" };
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

import connectDB from "./config/db.js";
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

//Routes
import userRoute from "./routes/userRoute.js";
import propertyRoute from "./routes/propertyRoute.js";
import orderRoute from "./routes/orderRoute.js";

import authRoutes from "./routes/auth.js";
import shipmentRoutes from "./routes/shipments.js";
import customerRoutes from "./routes/customers.js";

app.get("/", (req, res) => {
  res.status(200).json({ message: "properties_API" });
});
app.use("/api/users", userRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/orders", orderRoute);

app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/customers", customerRoutes);

//Error Middleware
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
