import express from "express";
const router = express.Router();
import Users from "../models/User.js";
import auth from "../middleware/auth.js";

router.get("/auth", auth, async (req, res) => {
  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    phone: req.user.phone,
  });
});

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [staffs, total] = await Promise.all([
      staffs.find().skip(skip).limit(limit).sort({ name: 1 }),
      staffs.countDocuments(),
    ]);
    res.json({
      data: staffs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
