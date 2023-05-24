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
router.get("/renters", getOrderByRenters);
router.get("/buyers", getOrderByBuyers);

router.post("/", addOrder);
router.post("/property", getOrderByProperty);

export default router;
