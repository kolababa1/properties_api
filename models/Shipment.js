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
    username: String,
    trackingId: String,
    receivedDate: { type: Date, default: new Date() },
    shippingDate: Date,
    pickupDate: Date,
  },
  { timestamps: true }
);

const shipment = mongoose.model("Shipment", shipmentSchema);
export default shipment;
