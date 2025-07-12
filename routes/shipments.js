import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { createShipment, getAllShipments } from "../controllers/shipments.js";

// Create shipment
router.post("/", auth, authorize("staff", "admin"), createShipment);

// Get all shipments with filters, pagination, and customer filter
router.get("/", getAllShipments);

// Get shipment by ID
router.get("/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate("sender")
      .populate("receiver");
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
