import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
      unique: true, 
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 500,
      index: "text", 
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true, 
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Indumentaria", "Cascos", "Botas"],
      index: true, 
    },
    thumbnail: {
      type: [String],
      trim: true,
      default: [],
    },
  },
  { timestamps: true }
);


productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;
