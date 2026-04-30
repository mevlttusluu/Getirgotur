import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { User } from "../models/User.js";
import { attachUser } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.use(attachUser);

authRouter.get("/me", (req, res) => {
  return res.json({ user: req.user });
});

authRouter.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("gg.sid");
    res.json({ ok: true });
  });
});

authRouter.post("/register", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(4),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const { name, phone, email, password } = parsed.data;
  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    phone,
    email: email.toLowerCase().trim(),
    passwordHash,
    role: "user",
  });

  req.session.userId = String(user._id);
  return res.status(201).json({
    user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
});

authRouter.post("/login", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const email = parsed.data.email.toLowerCase().trim();
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  req.session.userId = String(user._id);
  return res.json({
    user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
});

