import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  addOrder,
  getOrderByBuyers,
  getOrderByRenters,
  getOrderByUser,
  getOrders,
} from "../controllers/orderController.js";
const router = express.Router();

router.get("/", getOrders);
// router.get("/:id", getOrderById);
router.get("/user", getOrderByUser);
router.get("/renters", getOrderByRenters);
router.get("/buyers", getOrderByBuyers);

router.post("/", protect, addOrder);

export default router;
