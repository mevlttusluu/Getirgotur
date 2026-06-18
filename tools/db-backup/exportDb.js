import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../backend/.env") });

const COLLECTIONS = ["users", "products", "orders", "sessions"];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Hata: backend/.env dosyasında MONGODB_URI tanımlı olmalı.");
    process.exit(1);
  }

  const outDir = path.join(__dirname, "../../teslim/veritabani_yedegi");
  fs.mkdirSync(outDir, { recursive: true });

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const manifest = {
    exportedAt: new Date().toISOString(),
    database: db.databaseName,
    collections: {},
  };

  for (const name of COLLECTIONS) {
    const docs = await db.collection(name).find({}).toArray();
    const filePath = path.join(outDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), "utf8");
    manifest.collections[name] = docs.length;
    console.log(`[export] ${name}: ${docs.length} kayıt`);
  }

  fs.writeFileSync(
    path.join(outDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  await mongoose.disconnect();
  console.log(`[export] Tamamlandı → ${outDir}`);
}

main().catch((err) => {
  console.error("[export] Hata:", err);
  process.exit(1);
});
