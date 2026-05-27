import express from "express";
import { getBooks, getBook } from "../controllers/book.controller";

const Route = express.Router();

Route.get("/", getBooks);
Route.get("/:book", getBook);

export default Route;
