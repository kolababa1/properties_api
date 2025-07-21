import express from "express";
const router = express.Router();
import Users from "../models/User.js";

// Get a User
router.get("/:id", async (req, res) => {
  try {
    const staff = await Users.findOne({ phone: req.query.phone });
    if (!staff) return res.status(404).json({ message: "staff not found " });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all Staffs
router.get("/", async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const skip = (page - 1) * limit;
    // const [staffs, total] = await Promise.all([
    //   staff.find().skip(skip).limit(limit).sort({ name: 1 }),
    //   staff.countDocuments(),
    // ]);
    const staffs = await Users.find();
    res.json({
      data: staffs,
      //   currentPage: page,
      //   totalPages: Math.ceil(total / limit),
      //   totalItems: total,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
