"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controllers/book.controller");
const Route = express_1.default.Router();
Route.get("/", book_controller_1.getBooks);
Route.get("/:book", book_controller_1.getBook);
exports.default = Route;
