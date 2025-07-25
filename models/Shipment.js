import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemName: String,
  weight: Number,
  quantity: Number,
});

const shipmentSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [itemSchema],
    totalWeight: Number,
    packagingWeight: { type: Number, default: 0 },
    rate: Number,
    totalAmount: Number,
    username: String,
    trackingId: String,
    receivedDate: { type: Date, default: new Date() },
    shippingDate: { type: Date, default: null },
    pickupDate: { type: Date, default: null },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: String,
      default: null,
    },
    updatedBy: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const shipment = mongoose.model("Shipment", shipmentSchema);
export default shipment;
