import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    gender: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0
    },
    profileImg: {
      data: Buffer,
      contentType: String,
    } 
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
