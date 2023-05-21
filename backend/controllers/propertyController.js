import asyncHandler from "express-async-handler";

import Property from "../models/propertyModel.js";

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({});
  res.send(properties);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProperty = asyncHandler(async (req, res) => {
  const { name, description, isTaken, category, location, price } = req.body;

  const property = await Property.create({
    name,
    description,
    isTaken,
    category,
    location,
    price,
  });

  if (property) {
    res.status(201).json(property);
  } else {
    res.status(400);
    throw new Error("Property not created");
  }
});

export { getProperties, createProperty };
