import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { User } from "../models/User.js";
import { attachUser, requireAdmin, requireAuth } from "../middleware/auth.js";

export const usersRouter = Router();
usersRouter.use(attachUser);

usersRouter.get("/", requireAdmin, async (_req, res) => {
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .select({ name: 1, email: 1, phone: 1, role: 1, createdAt: 1 })
    .lean();
  res.json({ users });
});

usersRouter.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

usersRouter.put("/me", requireAuth, async (req, res) => {
  const schema = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(4).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const update = { ...parsed.data };
  if (update.email) update.email = update.email.toLowerCase().trim();
  if (update.password) {
    const passwordHash = await bcrypt.hash(update.password, 10);
    delete update.password;
    update.passwordHash = passwordHash;
  }

  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true },
    ).lean();
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
      },
    });
  } catch (e) {
    // likely duplicate email
    return res.status(409).json({ message: "Update failed" });
  }
});

