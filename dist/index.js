"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const verse_route_1 = __importDefault(require("./routes/verse.route"));
const book_route_1 = __importDefault(require("./routes/book.route"));
const prisma_1 = require("./lib/prisma");
// config
dotenv_1.default.config();
// Variable
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/verse", verse_route_1.default);
app.use("/book", book_route_1.default);
app.get("/", (req, res) => {
    return res.send("<div style='height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background-color: black;'><h1 style='font-size: 40px; color: white;'>Alktab API TB</h1></div>");
});
if (process.env.NODE_ENV !== "production") {
    const SERVER_PORT = process.env.SERVER_PORT || 3000;
    app.listen(SERVER_PORT, () => console.log(`server up and running on port ${SERVER_PORT}`));
}
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
app.get("/health", async (req, res) => {
    const dbPath = path_1.default.resolve(process.cwd(), "dev.sqlite");
    const fileExists = fs_1.default.existsSync(dbPath);
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.status(200).json({
            status: "ok",
            database: "connected",
            dbPath,
            fileExists,
        });
    }
    catch (err) {
        res.status(503).json({
            status: "error",
            database: "disconnected",
            dbPath,
            fileExists,
            error: String(err),
        });
    }
});
app.listen(SERVER_PORT, () => console.log(`server up and running on port ${SERVER_PORT}`));
