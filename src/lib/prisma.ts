import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.resolve(process.cwd(), "dev.sqlite")}`,
});

export const prisma = new PrismaClient({
  adapter,
});
