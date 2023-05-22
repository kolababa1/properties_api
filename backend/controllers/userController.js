import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

// @desc Register a new user
// route POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { name, dateOfBirth, location, email, role } = req.body;
  if (!name || !dateOfBirth || !location || !email) {
    res.status(403);
    throw new Error("All fields required");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    dateOfBirth,
    location,
    email,
    role,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Authenticates a user
// route POST /api/users/auth
const authUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(403);
    throw new Error("Please Input your Email");
  }

  const user = await User.findOne({ email });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("Invalid email, Register your credentials");
  }
});

// @desc Logout user
// route POST /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

// @desc Get all user
// route GET /api/users/
const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find({});
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("No User Yet");
  }
});

export { authUser, registerUser, logoutUser, getAllUser };
