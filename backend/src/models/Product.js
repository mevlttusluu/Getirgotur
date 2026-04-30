import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    img: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", ProductSchema);

