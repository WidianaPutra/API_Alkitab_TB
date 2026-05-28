import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "node:path";

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.resolve(__dirname, "./dev.sqlite")}`,
});

export const prisma = new PrismaClient({
  adapter,
});
