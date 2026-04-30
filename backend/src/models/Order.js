import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true }, // product.id
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    img: { type: String, default: "" },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    paymentMethod: { type: String, enum: ["cash", "card"], required: true },
    paymentDetails: {
      cardHolder: { type: String, default: "" },
      last4: { type: String, default: "" },
    },
    items: { type: [OrderItemSchema], default: [] },
    itemCount: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", OrderSchema);

