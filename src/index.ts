import express from "express";
import cors from "cors";
import env from "dotenv";
import VerseRoute from "./routes/verse.route";
import BookRoute from "./routes/book.route";
import { prisma } from "./lib/prisma";

// config
env.config();

// Variable
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();
app.use(cors());

app.use("/verse", VerseRoute);
app.use("/book", BookRoute);

app.get("/", (req, res) => {
  return res.send(
    "<div style='height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background-color: black;'><h1 style='font-size: 40px; color: white;'>Alktab API TB</h1></div>",
  );
});

if (process.env.NODE_ENV !== "production") {
  const SERVER_PORT = process.env.SERVER_PORT || 3000;
  app.listen(SERVER_PORT, () =>
    console.log(`server up and running on port ${SERVER_PORT}`),
  );
}

import fs from "fs";
import path from "path";

app.get("/health", async (req, res) => {
  const dbPath = path.resolve(process.cwd(), "dev.sqlite");
  const fileExists = fs.existsSync(dbPath);

  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      database: "connected",
      dbPath,
      fileExists,
    });
  } catch (err) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      dbPath,
      fileExists,
      error: String(err),
    });
  }
});

app.listen(SERVER_PORT, () =>
  console.log(`server up and running on port ${SERVER_PORT}`),
);
