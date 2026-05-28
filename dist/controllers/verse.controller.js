"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVerseByChapter = getAllVerseByChapter;
const prisma_1 = require("../lib/prisma");
async function getAllVerseByChapter(req, res) {
    try {
        const { book, chapter } = req.params;
        const isValidBookQuery = (query) => {
            return /^[a-zA-Z0-9\-]+$/.test(query);
        };
        if (!isValidBookQuery(book)) {
            res.status(400).json({ message: "Invalid book parameter" });
            return;
        }
        const chapterNumber = Number(chapter);
        if (Number.isNaN(chapterNumber)) {
            res.status(400).json({ message: "Invalid chapter number" });
            return;
        }
        const normalizeBookQuery = (query) => {
            return query
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
        };
        const normalizedBook = normalizeBookQuery(book);
        const targetChapter = await prisma_1.prisma.$queryRaw `
      SELECT c.*, b.name as bookName
      FROM Chapter c
      JOIN BibleBook b ON c.bibleBookId = b.id
      WHERE c.number = ${chapterNumber}
      AND REPLACE(LOWER(b.name), '-', ' ') = LOWER(${normalizedBook})
      LIMIT 1
    `;
        if (!targetChapter.length) {
            res.status(404).json({ message: "Chapter not found" });
            return;
        }
        const verses = await prisma_1.prisma.verse.findMany({
            where: { chapterId: targetChapter[0].id },
            orderBy: { number: "asc" },
        });
        res.status(200).json({
            book: targetChapter[0].bookName,
            chapter: targetChapter[0].number,
            verses: verses.map((verse) => ({
                number: verse.number,
                content: verse.content,
            })),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
