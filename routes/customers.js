import express from "express";
const router = express.Router();
import Customer from "../models/Customer.js";

// Create or update customer by phone
router.post("/", async (req, res) => {
  const { name, phone, address } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone is required" });

  try {
    const customer = await Customer.findOneAndUpdate(
      { phone },
      { name, address, phone },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get customer by phone
router.get("/byphone", async (req, res) => {
  try {
    const customer = await Customer.findOne({ phone: req.query.phone });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// List customers with pagination (optional)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      Customer.find().skip(skip).limit(limit).sort({ name: 1 }),
      Customer.countDocuments(),
    ]);
    res.json({
      data: customers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
