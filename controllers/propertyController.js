import asyncHandler from "../middleware/asyncHandler.js";

import Property from "../models/propertyModel.js";

// @desc    Fetch all properties
// @route   GET /api/properties
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({});
  res.send(properties);
});

// @desc    Create a Property
// @route   POST /api/properties
const createProperty = asyncHandler(async (req, res) => {
  const { name, description, isTaken, category, location, price } = req.body;
  if (!name || !location || !price) {
    res.status(403);
    throw new Error("All fields required");
  }

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
