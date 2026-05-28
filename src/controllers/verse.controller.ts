import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import type { Verse } from "@prisma/client";

type TargetChapter = {
  id: number;
  number: number;
  bibleBookId: number;
  bookName: string;
};

export async function getAllVerseByChapter(
  req: Request<{ book: string; chapter: string }>,
  res: Response,
): Promise<void> {
  try {
    const { book, chapter } = req.params;

    const isValidBookQuery = (query: string): boolean => {
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

    const normalizeBookQuery = (query: string): string => {
      return query
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    };

    const normalizedBook = normalizeBookQuery(book);

    const targetChapter = await prisma.$queryRaw<TargetChapter[]>`
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

    const verses = await prisma.verse.findMany({
      where: { chapterId: targetChapter[0].id },
      orderBy: { number: "asc" },
    });

    res.status(200).json({
      book: targetChapter[0].bookName,
      chapter: targetChapter[0].number,
      verses: verses.map((verse: Verse) => ({
        number: verse.number,
        content: verse.content,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
