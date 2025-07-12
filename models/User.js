import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "staff"],
    default: "staff",
  },
});

const user = mongoose.model("Users", usersSchema);
export default user;
