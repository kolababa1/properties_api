import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from "mongoose";

import Order from "../models/orderModel.js";
import Property from "../models/propertyModel.js";
import User from "../models/userModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrder = asyncHandler(async (req, res) => {
  const { bookingType, propertyId, email } = req.body;

  //Validates fields
  if (!bookingType || !propertyId || !email) {
    res.status(403);
    throw new Error("All fields required");
  }

  //Checks if the property Exists
  const propertyExist = await Property.findById({ _id: propertyId });
  if (!propertyExist) {
    res.status(404);
    throw new Error("No Such Property");
  }
  //Checks if the user Exists
  const userExist = await User.findById({ email });
  if (!userExist) {
    res.status(404);
    throw new Error("Invalid email, register you credentials");
  }
  const { _id: userId, role } = userExist;

  //Prevents duplicate order
  const orderExist = await Order.findOne({ userId, propertyId });
  if (orderExist && bookingType === "sale") {
    res.status(400);
    throw new Error("Order already exists");
  }
  if (orderExist && bookingType === "rent") {
    res.status(400);
    throw new Error("Order already exists");
  }

  //creates rent order
  if (
    role === "renter" &&
    bookingType === "rent" &&
    propertyExist.category === "rent"
  ) {
    const order = await Order.create({
      userId,
      propertyId,
      bookingType,
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Couldnt complete transaction");
    }
  }
  //creates sale order
  else if (
    role === "buyer" &&
    bookingType === "sale" &&
    propertyExist.category === "sale"
  ) {
    const order = await Order.create({
      userId,
      propertyId,
      bookingType,
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Couldnt complete transaction");
    }
  } else {
    res.status(400);
    throw new Error("You are not eligible for this Transaction");
  }
});

// @desc    Gets List of all Renters
// @route   GET /api/orders/renters
const getOrderByRenters = asyncHandler(async (req, res) => {
  const orders = await Order.find({ bookingType: "rent" }).populate(
    "userId",
    "name dateOfBirth"
  );
  if (orders) {
    const orderDetails = orders.map((order) => ({
      Name: order.userId.name,
      DOB: order.userId.dateOfBirth,
      PropertyId: order.propertyId,
    }));
    res.json(orderDetails);
  } else {
    res.status(404);
    throw new Error("No Renters");
  }
});

// @desc    Gets List of all Buyers
// @route   GET /api/orders/buyers
const getOrderByBuyers = asyncHandler(async (req, res) => {
  const orders = await Order.find({ bookingType: "sale" }).populate(
    "userId",
    "name dateOfBirth"
  );
  if (orders) {
    const orderDetails = orders.map((order) => ({
      Name: order.userId.name,
      DOB: order.userId.dateOfBirth,
      PropertyId: order.propertyId,
    }));
    res.json(orderDetails);
  } else {
    res.status(404);
    throw new Error("No Buyers");
  }
});

// @desc    Returns Orders by Property
// @route   POST /api/orders/property
const getOrderByProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.body;

  if (!propertyId) {
    res.status(403);
    throw new Error("Valid property Id is required");
  }
  //check if its a valid mongoDB id
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(403);
    throw new Error("Valid property Id is required");
  }

  const checkOrder = await Order.find({ propertyId });
  if (!checkOrder || checkOrder.length === 0) {
    res.status(404);
    throw new Error("No match for this property");
  }

  const orders = await Order.find({ propertyId })
    .populate("userId")
    .populate("propertyId");

  if (orders) {
    const propertyDetails = orders.map((order) => ({
      Customer_Name: order.userId.name,
      DOB: order.userId.dateOfBirth,
      Property_Name: order.propertyId.name,
      Property_Description: order.propertyId.description,
      Price: order.propertyId.price,
    }));
    res.json(propertyDetails);
  } else {
    res.status(404);
    throw new Error("No match for this property");
  }
});

// @desc    Get all orders
// @route   GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("userId").populate("propertyId");
  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error("No Order Yet");
  }
});

export {
  addOrder,
  getOrders,
  getOrderByProperty,
  getOrderByBuyers,
  getOrderByRenters,
};
