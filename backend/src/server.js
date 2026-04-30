import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app.js";
import { connectDb } from "./utils/connectDb.js";

const PORT = Number(process.env.PORT || 5000);

async function main() {
  await connectDb();
  const app = await createApp();
  app.listen(PORT, () => {
    console.log(`[backend] listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("[backend] failed to start", err);
  process.exit(1);
});

