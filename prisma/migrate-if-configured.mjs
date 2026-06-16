// Runs `prisma migrate deploy` only when a DATABASE_URL is configured.
// On the demo deploy (no DB) it skips cleanly so the build still succeeds;
// on a real deploy (DATABASE_URL set in Vercel) it creates/updates the tables.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("ℹ No DATABASE_URL set — skipping `prisma migrate deploy` (demo build).");
  process.exit(0);
}

console.log("▶ DATABASE_URL found — running `prisma migrate deploy`…");
execSync("npx prisma migrate deploy", { stdio: "inherit" });
