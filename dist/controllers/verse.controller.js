"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVerseByChapter = getAllVerseByChapter;
const prisma_1 = require("../lib/prisma");
async function getAllVerseByChapter(req, res) {
    try {
        const { book, chapter } = req.params;
        const result = book.charAt(0).toUpperCase() + book.slice(1);
        const chapterNumber = Number(chapter);
        if (Array.isArray(result)) {
            return res.status(400).json({
                message: "Invalid book parameter",
            });
        }
        // Validate chapter param
        if (Number.isNaN(chapterNumber)) {
            return res.status(400).json({
                message: "Invalid chapter number",
            });
        }
        // Find chapter by book name + chapter number
        const targetChapter = await prisma_1.prisma.chapter.findFirst({
            where: {
                number: chapterNumber,
                bibleBook: {
                    name: {
                        equals: result,
                    },
                },
            },
            include: {
                bibleBook: true,
                verses: {
                    orderBy: {
                        number: "asc",
                    },
                },
            },
        });
        // Chapter not found
        if (!targetChapter) {
            return res.status(404).json({
                message: "Chapter not found",
            });
        }
        // Transform response
        const verses = targetChapter.verses.map((verse) => ({
            number: verse.number,
            content: verse.content,
        }));
        return res.status(200).json({
            book: targetChapter.bibleBook.name,
            chapter: targetChapter.number,
            verses,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
