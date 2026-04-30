import { Router } from "express";
import { z } from "zod";

import { attachUser, requireAdmin } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export const ordersRouter = Router();
ordersRouter.use(attachUser);

ordersRouter.get("/", requireAdmin, async (_req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
  res.json({ orders });
});

ordersRouter.get("/my", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ orders });
});

ordersRouter.post("/", async (req, res) => {
  const schema = z.object({
    customer: z.object({
      name: z.string().min(1),
      phone: z.string().min(1),
      email: z.string().email(),
      address: z.string().min(1),
    }),
    paymentMethod: z.enum(["cash", "card"]),
    paymentDetails: z
      .object({
        cardHolder: z.string().optional(),
        last4: z.string().optional(),
      })
      .optional(),
    items: z
      .array(
        z.object({
          id: z.coerce.number().int(),
          name: z.string().min(1),
          quantity: z.coerce.number().int().min(1),
          price: z.coerce.number().nonnegative(),
          img: z.string().optional(),
        }),
      )
      .min(1),
    itemCount: z.coerce.number().int().min(1),
    totalPrice: z.coerce.number().nonnegative(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const orderId = `GG-${Date.now()}`;
  const payload = parsed.data;

  // stock check + decrement
  for (const it of payload.items) {
    const product = await Product.findOne({ id: it.id });
    if (!product) return res.status(400).json({ message: `Product not found: ${it.id}` });
    if (Number(product.stock) < Number(it.quantity)) {
      return res.status(409).json({ message: `Insufficient stock: ${product.name}` });
    }
  }
  for (const it of payload.items) {
    await Product.updateOne({ id: it.id }, { $inc: { stock: -Number(it.quantity) } });
  }

  const created = await Order.create({
    orderId,
    userId: req.user?._id ?? null,
    customer: {
      ...payload.customer,
      email: payload.customer.email.toLowerCase().trim(),
    },
    paymentMethod: payload.paymentMethod,
    paymentDetails: payload.paymentDetails
      ? {
          cardHolder: payload.paymentDetails.cardHolder || "",
          last4: payload.paymentDetails.last4 || "",
        }
      : { cardHolder: "", last4: "" },
    items: payload.items.map((it) => ({
      id: Number(it.id),
      name: it.name,
      quantity: Number(it.quantity),
      price: Number(it.price),
      img: it.img || "",
    })),
    itemCount: Number(payload.itemCount),
    totalPrice: Number(payload.totalPrice),
  });

  res.status(201).json({ order: created.toObject() });
});

