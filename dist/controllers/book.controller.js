"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBook = getBook;
exports.getBooks = getBooks;
const prisma_1 = require("../lib/prisma");
async function getBook(req, res) {
    try {
        const { book } = req.params;
        const isValidBookQuery = (query) => {
            return /^[a-zA-Z0-9\-]+$/.test(query);
        };
        if (!isValidBookQuery(book)) {
            res.status(400).json({ message: "Invalid book parameter" });
            return;
        }
        const normalizeBookQuery = (query) => {
            return query
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
        };
        const normalizedBook = normalizeBookQuery(book);
        const targetBook = await prisma_1.prisma.$queryRaw `
  SELECT * FROM BibleBook
  WHERE REPLACE(LOWER(name), '-', ' ') = LOWER(${normalizedBook})
  LIMIT 1
`;
        if (!targetBook.length) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        const chapters = await prisma_1.prisma.chapter.findMany({
            where: { bibleBookId: targetBook[0].id },
        });
        const { id, name } = targetBook[0];
        const bibleBook = {
            id,
            name,
            chapters: chapters.map((chapter) => ({
                id: chapter.id,
                bibleBook: `${name} ${chapter.number}`,
            })),
        };
        res.status(200).json(bibleBook);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function getBooks(req, res) {
    try {
        const targetBooks = await prisma_1.prisma.bibleBook.findMany({
            include: {
                _count: true,
            },
        });
        if (!targetBooks) {
            return res.status(404).json({
                message: "Chapter not found",
            });
        }
        return res.status(200).json({ books: targetBooks });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
