import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/products.js";
import { usersRouter } from "./routes/users.js";
import { ordersRouter } from "./routes/orders.js";
import { seedAdminUserIfMissing } from "./seed/seedAdminUserIfMissing.js";

export async function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  const mongoUrl = process.env.MONGODB_URI;
  if (!mongoUrl) {
    throw new Error("MONGODB_URI is required");
  }

  app.set("trust proxy", 1);
  app.use(
    session({
      name: "gg.sid",
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
      store: MongoStore.create({
        mongoUrl,
        collectionName: "sessions",
        ttl: 60 * 60 * 24 * 7,
      }),
    }),
  );

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/orders", ordersRouter);

  app.use((req, res) => {
    res.status(404).json({ message: "Not found", path: req.path });
  });

  await seedAdminUserIfMissing();

  return app;
}

