import express from "express";
import { getAllVerseByChapter } from "../controllers/verse.controller";

const Route = express.Router();

Route.get("/:book/:chapter", getAllVerseByChapter);

export default Route;
