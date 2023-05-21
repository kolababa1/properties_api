import mongoose from "mongoose";

const propertySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: "Property name is required",
    },
    description: {
      type: String,
      default: "Nice Property",
      required: "Property description is required",
    },
    isTaken: {
      type: Boolean,
      default: false,
      required: "Property status is required",
    },
    category: {
      type: String,
      default: "sale",
      enum: ["sale", "rent"],
      required: true,
    },
    location: {
      type: String,
      required: "Property location is required",
    },
    price: {
      type: Number,
      required: "Property price is required",
    },
  },
  {
    timestamps: true,
  }
);

const propertyModel = mongoose.model("Property", propertySchema);

export default propertyModel;
