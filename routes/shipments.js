import express from "express";
const router = express.Router();

// import auth from "../middleware/auth.js";
// import authorize from "../middleware/authorize.js";
import {
  createShipment,
  getAllShipments,
  getAShipment,
} from "../controllers/shipments.js";

// Create shipment
// router.post("/", auth, authorize("staff", "admin"), createShipment);
router.post("/", createShipment);

// Get shipment by ID
router.get("/:id", getAShipment);

// Get all shipments with filters, pagination, and customer filter
router.get("/", getAllShipments);

export default router;
