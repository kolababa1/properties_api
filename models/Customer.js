import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, unique: true, required: true, index: true },
    address: String,
  },
  { timestamps: true }
);

const customer = mongoose.model("Customer", customerSchema);
export default customer;
