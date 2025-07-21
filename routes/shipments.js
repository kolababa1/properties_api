import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import {
  createShipment,
  getAllShipments,
  getAShipment,
  softDeleteShipmentsById,
  softDeleteMultipleShipments,
} from "../controllers/shipments.js";

// Create shipment
router.post("/", auth, authorize("staff", "admin"), createShipment);

// Get shipment by ID
router.get("/:id", getAShipment);

// Get all shipments with filters, pagination, and customer filter
router.get("/", getAllShipments);

router.delete(
  "/:id",
  auth,
  authorize("staff", "admin"),
  softDeleteShipmentsById
);

router.delete(
  "/",
  auth,
  authorize("staff", "admin"),
  softDeleteMultipleShipments
);

export default router;
