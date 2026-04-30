import { User } from "../models/User.js";

export async function attachUser(req, _res, next) {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      req.user = null;
      return next();
    }
    const user = await User.findById(userId).lean();
    req.user = user
      ? { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
      : null;
    return next();
  } catch (e) {
    req.user = null;
    return next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  return next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  return next();
}

