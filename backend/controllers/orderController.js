import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Property from "../models/propertyModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrder = asyncHandler(async (req, res) => {
  const { bookingType, propertyId } = req.body;
  const { _id: userId, role } = req.user;

  //Checks if the property Exists and available
  const propertyExist = await Property.findById({ _id: propertyId });
  //   if (propertyExist) {
  //     res.status(400);
  //     throw new Error("Property not available");
  //   }

  //Prevents duplicate order
  const orderExist = await Order.findOne({ userId, propertyId });
  if (orderExist && bookingType === "sale") {
    res.status(400);
    throw new Error("Order already exists");
  }
  if (orderExist && propertyExist.isTaken && bookingType === "rent") {
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
// const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate(
//     "user",
//     "name email"
//   );

//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// @desc    Get logged in user orders
// @route   GET /api/orders/renters
const getOrderByRenters = asyncHandler(async (req, res) => {
  const orders = await Order.find({ bookingType: "rent" }).populate(
    "userId",
    "name dateOfBirth"
  );
  res.json(orders);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/buyers
const getOrderByBuyers = asyncHandler(async (req, res) => {
  const orders = await Order.find({ bookingType: "sale" }).populate(
    "userId",
    "name dateOfBirth"
  );
  res.json(orders);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getOrderByUser = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "userId",
    "name dateOfBirth"
  );
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("userId", "name dateOfBirth");
  res.json(orders);
});

export {
  addOrder,
  getOrderByUser,
  getOrders,
  getOrderByBuyers,
  getOrderByRenters,
};
