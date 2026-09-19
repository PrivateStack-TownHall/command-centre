/**
 * Creates the database named in DATABASE_URL if it doesn't exist yet, so the
 * project needs no psql, createdb or Docker command.
 *
 *   npm run db:create
 *   E2E_DATABASE_URL=... npm run db:create      (for the test database)
 */
import pg from "pg";

const url = process.env.E2E_DATABASE_URL ?? process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env first.");
  process.exit(1);
}

const target = new URL(url);
const name = decodeURIComponent(target.pathname.replace(/^\//, ""));

if (!name) {
  console.error(`No database name in the connection string: ${url}`);
  process.exit(1);
}

// Connect to the server's default database to create the new one.
const admin = new URL(url);
admin.pathname = "/postgres";

const client = new pg.Client({ connectionString: admin.toString() });

try {
  await client.connect();
} catch (error) {
  console.error(`Could not reach PostgreSQL at ${admin.host}: ${error.message}`);
  console.error("Is PostgreSQL running, and are the user and password correct?");
  process.exit(1);
}

const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [name]);

if (rowCount > 0) {
  console.log(`Database "${name}" already exists.`);
} else {
  // Identifiers can't be parameterised, so quote it safely instead.
  await client.query(`CREATE DATABASE "${name.replace(/"/g, '""')}"`);
  console.log(`Created database "${name}".`);
}

await client.end();
