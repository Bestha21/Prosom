import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const databaseUrl = process.env.AWS_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "AWS_DATABASE_URL or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: databaseUrl,
  // This ensures SSL is used if we are NOT on localhost
  ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1') 
    ? undefined 
    : { rejectUnauthorized: false }
});
export const db = drizzle(pool, { schema });
