/**
 * Local development Postgres via embedded-postgres — runs a real Postgres
 * server with no Docker and no external account. Data persists in ./.pgdata.
 *
 *   npm run db:local      # start (keeps running in the foreground)
 *
 * Connection: postgresql://postgres:postgres@localhost:5432/bazaaros
 * (matches DATABASE_URL in .env)
 */
import EmbeddedPostgres from "embedded-postgres";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), ".pgdata");

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
});

let started = false;

async function shutdown() {
  if (started) {
    try {
      await pg.stop();
    } catch {
      // ignore
    }
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function main() {
  const initialised = fs.existsSync(path.join(dataDir, "PG_VERSION"));
  if (!initialised) {
    console.log("Initialising Postgres data directory (.pgdata)...");
    await pg.initialise();
  }

  await pg.start();
  started = true;

  try {
    await pg.createDatabase("bazaaros");
    console.log("Created database: bazaaros");
  } catch {
    console.log("Database bazaaros already exists (ok)");
  }

  console.log(
    "READY: postgresql://postgres:postgres@localhost:5432/bazaaros",
  );

  // Keep the process (and the Postgres server) alive.
  setInterval(() => {}, 1 << 30);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
