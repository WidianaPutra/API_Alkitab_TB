import express from "express";
import cors from "cors";
import env from "dotenv";
import VerseRoute from "./routes/verse.route";
import BookRoute from "./routes/book.route";

// config
env.config();

// Variable
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();
app.use(cors());

app.use("/verse", VerseRoute);
app.use("/book", BookRoute);

app.listen(SERVER_PORT, () =>
  console.log(`server up and running on port ${SERVER_PORT}`),
);
