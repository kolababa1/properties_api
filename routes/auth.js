import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();
import validatePhone from "../utils/validatePhone.js";

// Register
router.post("/register", async (req, res) => {
  const { username, phone, password } = req.body;

  if (!username || !phone || !password)
    return res
      .status(400)
      .json({ msg: "Username, Phone number and password required" });

  if (!validatePhone(phone))
    return res.status(400).json({ msg: "Invalid phone number format" });

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser)
      return res.status(400).json({ msg: "Phone number already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password)
    return res.status(400).json({ msg: "Phone and password required" });

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
