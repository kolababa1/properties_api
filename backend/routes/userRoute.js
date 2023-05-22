import express from "express";
import {
  authUser,
  getAllUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);

router.get("/", getAllUser);

export default router;
