import { Router } from "express";
import { z } from "zod";

import { Product } from "../models/Product.js";
import { attachUser, requireAdmin } from "../middleware/auth.js";

export const productsRouter = Router();
productsRouter.use(attachUser);

productsRouter.get("/", async (_req, res) => {
  const products = await Product.find({}).sort({ id: -1 }).lean();
  res.json({ products });
});

productsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const product = await Product.findOne({ id }).lean();
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json({ product });
});

productsRouter.post("/", requireAdmin, async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    price: z.coerce.number().nonnegative(),
    stock: z.coerce.number().int().nonnegative().default(0),
    description: z.string().optional().default(""),
    img: z.string().optional().default(""),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const last = await Product.findOne({}).sort({ id: -1 }).lean();
  const nextId = (last?.id ?? 0) + 1;

  const product = await Product.create({ id: nextId, ...parsed.data });
  res.status(201).json({ product });
});

productsRouter.put("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  const schema = z.object({
    name: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    price: z.coerce.number().nonnegative().optional(),
    stock: z.coerce.number().int().nonnegative().optional(),
    description: z.string().optional(),
    img: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const product = await Product.findOneAndUpdate(
    { id },
    { $set: parsed.data },
    { new: true },
  ).lean();

  if (!product) return res.status(404).json({ message: "Not found" });
  res.json({ product });
});

productsRouter.delete("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const result = await Product.deleteOne({ id });
  if (result.deletedCount === 0) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

