"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verse_controller_1 = require("../controllers/verse.controller");
const Route = express_1.default.Router();
Route.get("/:book/:chapter", verse_controller_1.getAllVerseByChapter);
exports.default = Route;
