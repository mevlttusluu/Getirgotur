import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../backend/.env") });

const BACKUP_DIR = path.join(__dirname, "../../teslim/veritabani_yedegi");
const COLLECTIONS = ["users", "products", "orders", "sessions"];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Hata: backend/.env dosyasında MONGODB_URI tanımlı olmalı.");
    process.exit(1);
  }

  const clean = process.argv.includes("--clean");

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  for (const name of COLLECTIONS) {
    const filePath = path.join(BACKUP_DIR, `${name}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`[import] Atlandı (dosya yok): ${name}.json`);
      continue;
    }

    const docs = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (clean) {
      await db.collection(name).deleteMany({});
    }
    if (docs.length === 0) {
      console.log(`[import] ${name}: boş koleksiyon`);
      continue;
    }

    await db.collection(name).insertMany(docs);
    console.log(`[import] ${name}: ${docs.length} kayıt yüklendi`);
  }

  await mongoose.disconnect();
  console.log("[import] Tamamlandı.");
}

main().catch((err) => {
  console.error("[import] Hata:", err);
  process.exit(1);
});
