import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export async function seedAdminUserIfMissing() {
  const email = (process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const exists = await User.findOne({ email });
  if (exists) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    name: "Admin",
    phone: "-",
    email,
    passwordHash,
    role: "admin",
  });

  console.log(`[backend] seeded admin user: ${email}`);
}

