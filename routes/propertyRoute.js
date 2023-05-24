import express from "express";
import {
  createProperty,
  getProperties,
} from "../controllers/propertyController.js";

const router = express.Router();

router.get("/", getProperties);
router.post("/", createProperty);

export default router;
