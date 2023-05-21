import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Property",
    },
    bookingType: {
      type: String,
      required: true,
      enum: ["sale", "rent"],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
