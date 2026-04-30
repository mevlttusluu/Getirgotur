import dotenv from "dotenv";
dotenv.config({ path: new URL("../../backend/.env", import.meta.url).pathname });

import bcrypt from "bcryptjs";

import { connectDb } from "../../backend/src/utils/connectDb.js";
import { User } from "../../backend/src/models/User.js";
import { Product } from "../../backend/src/models/Product.js";
import { Order } from "../../backend/src/models/Order.js";
import { FakeDataFactory } from "./FakeDataFactory.js";

function parseArgs(argv) {
  const args = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args.set(key, true);
    } else {
      args.set(key, next);
      i += 1;
    }
  }
  return args;
}

function toInt(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

async function generateUniqueEmail(f, maxAttempts = 50) {
  for (let i = 0; i < maxAttempts; i += 1) {
    const name = f.fullName();
    const email = f.emailFromName(name);
    // eslint-disable-next-line no-await-in-loop
    const exists = await User.exists({ email });
    if (!exists) return { name, email };
  }
  throw new Error("Could not generate unique email");
}

async function generateUniqueOrderId(f, maxAttempts = 50) {
  for (let i = 0; i < maxAttempts; i += 1) {
    const orderId = f.orderId();
    // eslint-disable-next-line no-await-in-loop
    const exists = await Order.exists({ orderId });
    if (!exists) return orderId;
  }
  throw new Error("Could not generate unique orderId");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const seed = args.get("seed") ?? "getirgotur";
  const usersCount = toInt(args.get("users"), 20);
  const productsCount = toInt(args.get("products"), 80);
  const ordersCount = toInt(args.get("orders"), 40);
  const clean = Boolean(args.get("clean"));

  const f = new FakeDataFactory({ seed, locale: "tr-TR" });

  await connectDb();
  console.log("[fake-seed] connected");

  if (clean) {
    // Only delete collections we own in this project
    console.log("[fake-seed] cleaning collections");
    await Promise.all([Order.deleteMany({}), Product.deleteMany({}), User.deleteMany({ role: "user" })]);
    console.log("[fake-seed] cleaning done");
  }

  // ---- Users ----
  console.log("[fake-seed] generating users", { usersCount });
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const usersToInsert = [];
  for (let i = 0; i < usersCount; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const { name, email } = await generateUniqueEmail(f);
    usersToInsert.push({
      name,
      phone: f.phoneTR(),
      email,
      passwordHash,
      role: "user",
    });
  }

  let insertedUsers = [];
  if (usersToInsert.length) {
    console.log("[fake-seed] inserting users");
    insertedUsers = await User.insertMany(usersToInsert, { ordered: false });
    console.log("[fake-seed] inserted users", { count: insertedUsers.length });
  }

  // ---- Products ----
  console.log("[fake-seed] generating products", { productsCount });
  const latest = await Product.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
  let nextProductId = (latest?.id ?? 0) + 1;

  const productsToInsert = [];
  for (let i = 0; i < productsCount; i += 1) {
    const category = f.category();
    const name = f.unique("productName", () => f.productName(category));
    productsToInsert.push({
      id: nextProductId++,
      name,
      category,
      price: f.productPrice(category),
      stock: f.productStock(),
      description: f.productDescription(category),
      img: f.imageUrl(category),
    });
  }

  let insertedProducts = [];
  if (productsToInsert.length) {
    console.log("[fake-seed] inserting products");
    insertedProducts = await Product.insertMany(productsToInsert, { ordered: false });
    console.log("[fake-seed] inserted products", { count: insertedProducts.length });
  }

  console.log("[fake-seed] loading users/products for orders");
  const allUsers = insertedUsers.length ? insertedUsers : await User.find({ role: "user" }).lean();
  const allProducts = insertedProducts.length ? insertedProducts : await Product.find({}).lean();

  // ---- Orders ----
  console.log("[fake-seed] generating orders", { ordersCount });
  const ordersToInsert = [];
  for (let i = 0; i < ordersCount; i += 1) {
    const user = allUsers.length ? f.pick(allUsers) : null;
    const customerName = user?.name ?? f.fullName();
    const customerEmail = user?.email ?? f.unique("guestEmail", () => f.emailFromName(customerName));
    const customerPhone = user?.phone ?? f.phoneTR();

    const itemsCount = f.weightedPick([
      { value: 1, weight: 35 },
      { value: 2, weight: 30 },
      { value: 3, weight: 20 },
      { value: 4, weight: 10 },
      { value: 5, weight: 5 },
    ]);

    const pickedProducts = new Set();
    const items = [];
    for (let j = 0; j < itemsCount; j += 1) {
      const p = f.pick(allProducts);
      if (!p) break;
      const quantity = f.int(1, 4);
      if (pickedProducts.has(p.id)) {
        const existing = items.find((it) => it.id === p.id);
        if (existing) {
          existing.quantity += quantity;
          continue;
        }
      }

      pickedProducts.add(p.id);
      items.push({
        id: p.id,
        name: p.name,
        quantity,
        price: p.price,
        img: p.img ?? "",
      });
    }

    const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
    const totalPrice = Math.round(items.reduce((sum, it) => sum + it.price * it.quantity, 0) * 100) / 100;

    const paymentMethod = f.weightedPick([
      { value: "cash", weight: 55 },
      { value: "card", weight: 45 },
    ]);

    const paymentDetails =
      paymentMethod === "card"
        ? { cardHolder: customerName, last4: f.cardLast4() }
        : { cardHolder: "", last4: "" };

    ordersToInsert.push({
      // eslint-disable-next-line no-await-in-loop
      orderId: await generateUniqueOrderId(f),
      userId: user?._id ?? null,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: f.addressTR(),
      },
      paymentMethod,
      paymentDetails,
      items,
      itemCount,
      totalPrice,
    });
  }

  if (ordersToInsert.length) {
    console.log("[fake-seed] inserting orders");
    await Order.insertMany(ordersToInsert, { ordered: false });
    console.log("[fake-seed] inserted orders", { count: ordersToInsert.length });
  }

  console.log("[fake-seed] counting totals");
  const counts = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
  ]);

  console.log("[fake-seed] done", {
    inserted: { users: usersToInsert.length, products: productsToInsert.length, orders: ordersToInsert.length },
    totals: { users: counts[0], products: counts[1], orders: counts[2] },
    seed,
  });
}

main()
  .catch((err) => {
    console.error("[fake-seed] failed", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    // Close the *same* Mongo client used by backend models
    try {
      const client = User?.db?.client;
      if (client) {
        await client.close();
      }
    } catch {
      // ignore
    }
  });

