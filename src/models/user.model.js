import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true
    },

    last_name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    age: {
      type: Number,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carts"
    },

    role: {
      type: String,
      role: { type: String, enum: ['user', 'admin'], default: 'user' }
    },

    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("Users", userSchema);