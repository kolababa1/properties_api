import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  addOrder,
  getOrderByBuyers,
  getOrderByRenters,
  getOrderByProperty,
  getOrders,
} from "../controllers/orderController.js";
const router = express.Router();

router.get("/", getOrders);
// router.get("/:id", getOrderById);
router.get("/property", getOrderByProperty);
router.get("/renters", getOrderByRenters);
router.get("/buyers", getOrderByBuyers);

router.post("/", protect, addOrder);

export default router;
