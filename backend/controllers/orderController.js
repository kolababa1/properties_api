import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Property from "../models/propertyModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrder = asyncHandler(async (req, res) => {
  const { bookingType, propertyId } = req.body;
  const { _id: userId, role } = req.user;

  //Checks if the property Exists
  const propertyExist = await Property.findById({ _id: propertyId });

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
    return;
  }
});

// @desc    Gets List of all Renters
// @route   GET /api/orders/renters
const getOrderByRenters = asyncHandler(async (req, res) => {
  const orders = await Order.find({ bookingType: "rent" }).populate(
    "userId",
    "name dateOfBirth"
  );
  const orderDetails = orders.map((order) => ({
    Name: order.userId.name,
    DOB: order.userId.dateOfBirth,
    PropertyId: order.propertyId,
  }));
  res.json(orderDetails);
});

// @desc    Gets List of all Buyers
// @route   GET /api/orders/buyers
const getOrderByBuyers = asyncHandler(async (req, res) => {
  const orders = await Order.find({ bookingType: "sale" }).populate(
    "userId",
    "name dateOfBirth"
  );
  const orderDetails = orders.map((order) => ({
    Name: order.userId.name,
    DOB: order.userId.dateOfBirth,
    PropertyId: order.propertyId,
  }));
  res.json(orderDetails);
});

// @desc    Gets Orders by Property
// @route   GET /api/orders/property
const getOrderByProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.body;

  const orders = await Order.find({ propertyId })
    .populate("userId")
    .populate("propertyId");
  const propertyDetails = orders.map((order) => ({
    Customer_Name: order.userId.name,
    DOB: order.userId.dateOfBirth,
    Property_Name: order.propertyId.name,
    Property_Description: order.propertyId.description,
    Price: order.propertyId.price,
  }));
  res.json(propertyDetails);
});

// @desc    Get all orders
// @route   GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("userId").populate("propertyId");

  res.json(orders);
});

export {
  addOrder,
  getOrders,
  getOrderByProperty,
  getOrderByBuyers,
  getOrderByRenters,
};
